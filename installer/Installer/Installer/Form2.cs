using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using System.IO;

namespace Installer
{
    public partial class Form2 : Form
    {
        public Form2()
        {
            InitializeComponent();
        }

        private void Button1_Click(object sender, EventArgs e)
        {
            if(File.Exists(textBox1.Text + "\\node.exe"))
            {
                Form3 f = new Form3(textBox1.Text);
                f.Show();
                f.FormClosed += Fallback;
                this.Hide();
            }
            else
            {
                MessageBox.Show("Zły folder", "W podanym folderze nie ma node.exe", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        protected void Fallback(object sender, EventArgs e)
        {
            this.Close();
        }
    }
}
