# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"

  config.vm.network "forwarded_port", guest: 80, host: 8080
  config.vm.network "private_network", ip: "10.0.0.10"
  config.vm.host_name = "j4"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end

  # Install python for ansible
  config.vm.provision "shell", inline: <<-SHELL
    test -e /usr/bin/python || (apt -qqy update && apt install -qqy python-minimal)
  SHELL

  config.vm.provision "ansible" do |ansible|
    ansible.verbose = "v"
    ansible.playbook = "./provisioning/bot.yml"
  end
end
