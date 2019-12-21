const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser');
const app = express()
const Librus = require("librus-api");
const schedule = require('node-schedule');
var fs = require('fs');
const port = 8081

let client = new Librus();

prompt('librus', 'librus client created', 'info')
var sched_job;

prompt('fs', 'checking for data.json', 'info')
prepare((j, rel) => {
app.use(express.static(path.join(__dirname + '\\public')))
prompt('express', 'static MIME hosted', 'info')

app.set('views',path.join(__dirname + '\\views'))
app.set('view engine', 'hbs')
prompt('handlebars', 'handlebars view engine initialized', 'info')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
prompt('express', 'json parser initialized', 'info')
//app.use(express.methodOverride())

app.get('/', (req,res) => {
	prompt('express', 'http client connected with ip: ' + req.ip + ' and body: ' + req.cookies, 'info')
	prompt('handlebars', 'producing view \'index\' for new client', 'info')
	res.render('index');
})

app.post('/nauczyciel', (req,res) => {	
	var username = req.body.username;
	prompt('express', 'http client filled form with ip: ' + req.ip + ' and username: ' + username, 'info')
	var passwd = req.body.passwd;
	var weekday = req.body.weekday;
	var hour = req.body.hour;
	var zwrot = req.body.zwrot;
	var day_rel = req.body.day_rel;
	var start = req.body.start;
	var stop = req.body.stop;

	if(zwrot == "Pani")
		zwrot = "";

	if(username == "" || passwd == "" || username == undefined){
		prompt('librus', 'empty username and/or password', 'error')
		prompt('express', 'invalid credentials for client with ip: ' + req.ip, 'warn')
		res.send('Użytkownik lub hasło nie poprawne');
		return
	}
	prompt('librus', 'attempting login', 'info')
	client.authorize(username, passwd, function (){

		if(client.failed == true){
			prompt('librus', 'invalid username and/or password', 'error')
			prompt('express', 'invalid credentials for client with ip: ' + req.ip, 'warn')
			res.send("Użytkownik lub hasło nie poprawne")
			return;
		}

		prompt('librus', 'login successfull', 'info')
		client.info.getGrades().then(data => {
			prompt('librus', 'listing subjects to check integrity', 'info')
			prompt('librus', 'attempting to generate headmaster id', 'info')
			client.inbox.listReceivers('wychowawca').then(wychow => {	
				prompt('librus', 'attempting to get teacher id\'s', 'info')			
				client.inbox.listReceivers('nauczyciel').then(nauczy => {				
				prompt('librus', 'all reciver list succesfully generated','info')
			prompt('handlebars', 'producing view \'nauczyciel\' for new client with all data', 'info')
			res.render('nauczyciel', {
				subj: data[0].semester[0].grades,
				subname: data[0].name,
				zwrot: zwrot,
				username: username,
				weekday: weekday,
				hour: hour,
				passwd: passwd,
				wych: wychow,
				naucz: nauczy,
				rel_day: day_rel,
				start: start,
				stop: stop
			});
		})
		})
		});
	});
})

app.post('/status', (req,res) => {	
		prompt('fs', 'creating datafac structure', 'info')
		datafac = {
			wtid: req.body.tid,
			ntid: req.body.tid2,
			message: req.body.message,
			hour: req.body.hour,
			username: req.body.username,
			weekday: req.body.weekday,
			religion_day: req.body.rel_day,			
			passwd: req.body.passwd,
		};
		var json = JSON.stringify(datafac);
		prompt('json', 'converting caonfig data into json string', 'info')
		fs.writeFileSync('data.json', json, 'utf8', function(){});	
		prompt('fs', 'file written to end', 'info')
		prepare((jj, rell) => {
			if(j != undefined)
				j.cancel();
			j = jj;
			rel = rell;
			prompt('handlebars', 'producing view \'status\' for '+ req.ip +' client', 'info')
			res.render('status',{
				next: j.nextInvocation(),
				mess: req.body.message.replace('[data]',(new Date(rel.nextInvocation())).toLocaleDateString())
			});
		})
})

app.get('/status', (req,res) => {	
	if(j == undefined){
		prompt('express', 'tried to access status before scheduleing open', 'error')
		res.write('najpierw sie zaloguj');
		return;
	}		
	prompt('handlebars', 'producing view \'status\' for '+ req.ip +' client', 'info')
	res.render('status',{		
		next: j.nextInvocation(),
		mess: datafac.message.replace('[data]',(new Date(rel.nextInvocation())).toLocaleDateString())
	});	
})

app.get('/najlepszy_nauczyciel', (req, res) => {
	if(j == undefined){
		prompt('express', 'tried to access tyliba before logging', 'error')
		res.write('najpierw sie zaloguj');
		return;
	}
	prompt('json', 'parsing config file for credentials', 'info')
	datafac = JSON.parse(fs.readFileSync('data.json'));
	prompt('librus', 'attempting authorize', 'info')
	client.authorize(datafac.username, datafac.passwd, () => {
		prompt('librus', 'attempting inbox listing', 'info')
		client.inbox.listInbox(5).then((data) => {
		prompt('librus', 'inbox listing success', 'info')
		var count = 0;
		data.forEach((v) => {
			v.forEach((g) => {
				if(g.user == 'Tyliba Halina (Tyliba Halina)')
					count++;
			})
		})
		prompt('librus', 'total tyliba messages: ' + count, 'info')
		prompt('handlebars', 'producing view \'proftyliba\' for '+ req.ip +' client', 'info')
		res.render('proftyliba',{		
			count: count
		});		
	})
	})
})

app.listen(port, () => prompt('express', 'http listener successfully started on localhost:' + port, 'info'))
})

function prompt(module, message, severity){
	var color

	switch(severity){
		case 'info':
			color = 96
			break;
		case 'warn':
			color = 93
			break;
		case 'error':
			color = 91
			break;
	}

	console.log('\x1b[%dm[%s][%s][%s] %s\x1b[0m', color, new Date().toISOString(), module, severity, message)
}

function prepare(afetr_done){
	fs.exists('data.json', (exists) => {
	if(exists){
 		datafac = JSON.parse(fs.readFileSync('data.json'));
  		var dayweek;
  		var dayrel;
  		var j, rel;
  		switch(datafac.weekday){
  			case "Poniedziałek":
  				dayweek = 1;
  				break;
  			case "Wtorek":
		  		dayweek = 2;
  				break;
  			case "Środa":
  				dayweek = 3;
  				break;
 	 		case "Czwartek":
		  		dayweek = 4;
  				break;
  			case "Piątek":
		  		dayweek = 5;
  				break;
		  	case "Sobota":
  				dayweek = 6;
  				break;
		  	case "Niedziela":
	  			dayweek = 0;
  					break;
  		}

  		switch(datafac.religion_day){
  			case "Poniedziałek":
  				dayrel = 1;
  				break;
  			case "Wtorek":
		  		dayrel = 2;
  				break;
  			case "Środa":
  				dayrel = 3;
  				break;
 	 		case "Czwartek":
		  		dayrel = 4;
  				break;
  			case "Piątek":
		  		dayrel = 5;
  				break;
		  	case "Sobota":
  				dayrel = 6;
  				break;
		  	case "Niedziela":
	  			dayrel = 0;
  					break;
  		}
  		rel = schedule.scheduleJob('00 12 * * '+dayrel, function(){});

		if(j != undefined)
			j.cancel();

  		j = schedule.scheduleJob('00 '+datafac.hour+' * * '+dayweek, function(){
  			if(message != "" && message	!= undefined){
	  		client.authorize(datafac.username, datafac.passwd, function (){
	  			var toSend = datafac.message.replace('[data]',(new Date(rel.nextInvocation())).toLocaleDateString())
	  			if(datafac.wtid == datafac.ntid)
  					client.inbox.sendMessage(datafac.wtid.split(',')[0], "zwolnienie", toSend);
  				else{
  					client.inbox.sendMessage(datafac.wtid.split(',')[0], "zwolnienie", toSend);
  					client.inbox.sendMessage(datafac.ntid.split(',')[0], "zwolnienie", toSend);
  				}
  			});
	  		}
		});
		prompt('schedule', 'reloaded current schedule for ' + new Date(j.nextInvocation()) , 'info')
		afetr_done(j, rel);
  	}
  	else
  		afetr_done(undefined, undefined);
  })
}