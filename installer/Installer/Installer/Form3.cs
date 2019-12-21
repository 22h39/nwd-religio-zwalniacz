using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;
using System.IO.Compression;

namespace Installer
{
    public partial class Form3 : Form
    {
        string node_path;
        public Form3(string path)
        {            
            InitializeComponent();
            this.node_path = path;
            this.Shown += Install;
        }
        public void Install(object sender, EventArgs e)
        {
            label2.Text = "CreateDir: " + node_path + "\\nwd";
            progressBar1.Value += 25;
            Directory.CreateDirectory(node_path + "\\nwd");
            label2.Text = "ExtractTo: " + node_path + "\\nwd";
            progressBar1.Value += 25;
            ZipFile.ExtractToDirectory(Directory.GetCurrentDirectory() + "\\nwd-rel-zwln.bin", node_path + "\\nwd\\");
            label2.Text = "SC CREATE zwalniacz binpath= \"" + node_path + "\\node.exe " + node_path + "\\nwd\\main.js\" type= own start= auto";
            progressBar1.Value += 50;
            System.Diagnostics.Process.Start("node.exe", "\"" + node_path + "\\nwd\\install.js\" \""+node_path+"\\nwd\\main.js\"");
            MessageBox.Show("Koniec", "Instalacja powiodła się", MessageBoxButtons.OK, MessageBoxIcon.Information);
            this.Close();
        }
    }
}
