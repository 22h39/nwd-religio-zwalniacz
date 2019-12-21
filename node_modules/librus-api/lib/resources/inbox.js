"use strict";
const Promise = require('bluebird');
const Resource = require("../tools.js").Resource
    , Librus = require("../api.js");

/**
 * Inbox tab class
 * @type {Inbox}
 */
module.exports = class Inbox extends Resource {
  /**
   * Get operation message
   * https://synergia.librus.pl/wiadomosci
   *
   * @param $ Page body
   * @returns {Promise}
   * @private
   */
  static _getConfirmMessage($) {
    let message = $(".green.container").trim();
    if(!message.length)
      return Promise.reject();
    else
      return message;
  }

  /**
   * Read message
   * https://synergia.librus.pl/wiadomosci/1
   *
   * @param folderId    Folder ID
   * @param messageId   Message ID
   * @returns {Promise}
   */
  getMessage(folderId, messageId) {
    const url = `wiadomosci/1/${folderId}/${messageId}`;
    return this.api._singleMapper(
      url
      , "table.stretch.container-message td.message-folders+td"
      , ($, row) => {
        let table = $(row).find("table:nth-child(2)")
          , header = Librus.mapTableValues(
            table
            , ($(table).find("b").first().trim() != "Nadawca" ? [] : ["user"]).concat(["title", "date"])
          );
        return {
          title: header.title,
          url,
          id: messageId,
          folderId: folderId,
          date: header.date,
          user: header.user || "",
          content: $(row).find(".container-message-content").trim(),
          html: $(row).find(".container-message-content").html(),
          read: $(row).find("td.left").last().trim() !== "NIE",
        };
      }
    );
  }

  /**
   * Remove message from inbox
   * https://synergia.librus.pl/wiadomosci
   *
   * @param messageId Message ID
   * @returns {Promise}
   */
  removeMessage(folderId, messageId) {
    return this.api._request("get"
      ,"wiadomosci/2/5"
      ).then($ => {
      this.api.meassage_request_key = $.html().substr($.html().indexOf("<input type=\"hidden\" name=\"requestkey\" value=\"") + 46, 72);
    return this.api._request
      ("post","usun_wiadomosc", {
        form: {
            'wiadomosciLista[]': messageId
          , 'folder': folderId
          , 'czyArchiwum': 0
        }}, "", "requestkey", this.api.meassage_request_key
      )
      .then($ => { if($.text() == "OK") { return Promise.resolve(); } else { return Promise.reject()} });
    })
  }

  /**
   * Move message from trash to inbox
   * https://synergia.librus.pl/wiadomosci
   *
   * @param messageId Message ID
   * @returns {Promise}
   */
  recoverMessage(messageId) {
    return this.api._request("get"
      ,"wiadomosci/2/5"
      ).then($ => {
      this.api.meassage_request_key = $.html().substr($.html().indexOf("<input type=\"hidden\" name=\"requestkey\" value=\"") + 46, 72);
    return this.api._request
      ("post","przywroc_wiadomosc", {
        form: {
            'wiadomosciLista[]': messageId
          , 'folder': 7
          , 'czyArchiwum': 0
        }}, "", "requestkey", this.api.meassage_request_key
      )
      .then($ => { if($.text() == "OK") { return Promise.resolve(); } else { return Promise.reject()} });
    })
  }

  /**
   * Send message to user
   * https://synergia.librus.pl/wiadomosci/2/5
   *
   * @param userId    User ID
   * @param title     Message title
   * @param content   Message content
   * @returns {Promise}
   */
  sendMessage(userId, title, content) {
    /** Fetch cookies */
    let sendPromise = () => {
      /** Send message */
      return this.api._request("get"
      ,"wiadomosci/2/5"
      ).then($ => {
      this.api.meassage_request_key = $.html().substr($.html().indexOf("<input type=\"hidden\" name=\"requestkey\" value=\"") + 46, 72);
      return this.api.caller
        .post("wiadomosci/5", {
          form: {
            'requestkey': this.api.meassage_request_key
            , 'DoKogo[]': userId
            , 'temat': title
            , 'tresc': content
            , 'poprzednia': 5
            , 'wyslij': "Wy%C5%9Blij"
          }
        })
      })
    };
    return this.api.caller
      .get("wiadomosci/2/5", null, true)
      .then(sendPromise);
  }

  /**
   * Get recipient list from group
   * https://synergia.librus.pl/wiadomosci/2/5
   *
   * @returns {Promise}
   */
  listReceivers(group) {
    return this.api._request("get"
      ,"wiadomosci/2/5"
      ).then($ => {
      this.api.meassage_request_key = $.html().substr($.html().indexOf("<input type=\"hidden\" name=\"requestkey\" value=\"") + 46, 72);
      return this.api._mapper(
        "wiadomosci/2/5"
      , "td.message-recipients table.message-recipients-detail tr[class*='line']"
      , ($, row) => {
        return {
            id: parseInt($(row).find("input[name='DoKogo[]']").val())
          , user: $(row).find("label").trim()
        };
      }
      , "post"
      , {
        form: { 
          'adresat': group,
          'requestkey': this.api.meassage_request_key
         }
      });
    })    
  }

  /**
   * List inbox all messages headers
   * https://synergia.librus.pl/wiadomosci
   *
   * @param folderId  Folder number
   * @returns {Promise}
   */
  listInbox(folderId) {
    let page_count = 0;
    let pages = [];

    const page_parser = ($, row) => {
      if($(row)[0].attribs.class != 'jump'){
        page_count++
        pages.push(page_count)
      }
    };

    /** Parser */
    const parser = ($, row) => {
      /** get data from table */
      const children = $(row).children("td");
      return {
        id: parseInt($(children[3]).find("a").attr("href").split(/[/]/)[4])
        , user: $(children[2]).trim()
        , title: $(children[3]).trim()
        , date: $(children[4]).trim()
        , read: $(children[2]).attr('style') != "font-weight: bold;"
      };
    };

    /** API call */
    return this.api._request("get"
      ,"wiadomosci_aktualne"
      ).then((g) => {
        this.api.meassage_request_key = g.html().substr(g.html().indexOf("<input type=\"hidden\" name=\"requestkey\" value=\"") + 46, 72);
        return this.api
        ._mapper(
        `wiadomosci/${folderId}`
        , "table.container-message div.pagination ul li"
        , page_parser
        , "get").then((p) => {   
          if(page_count == 0){
            page_count == 1
          }

          return Promise.map(pages, page => {
            return this.api
            ._mapper(
            `wiadomosci/${folderId}`
            , "table.container-message table.decorated.stretch tbody tr"
            , parser
            , "post"
            , {
                form: { 
                'requestkey': this.api.meassage_request_key,
                'idPojemnika': 105,
                'numer_strony105': page,
                'porcjowanie_pojemnik105': 105,
                'poprzednia': 5
              }
            })
          }, {concurrency: 50})
      }
      )});
  }  

  /**
   * List all announcements
   * https://synergia.librus.pl/ogloszenia
   *
   * @returns {Promise}
   */
  listAnnouncements() {
    return this.api._mapper(
        "ogloszenia"
      , "div#body div.container-background table.decorated"
      , ($, row) => {
        let cols = $(row).find("td");
        return {
            title: $(row).find("thead").trim()
          , user: $(cols[1]).trim()
          , date: $(cols[2]).trim()
          , content: $(cols[3]).trim()
        };
      });
  }
};
