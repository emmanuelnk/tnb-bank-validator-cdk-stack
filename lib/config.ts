import * as dotenv from 'dotenv'

dotenv.config({ path: __dirname+'/.env' })

export const config = {
    stack: {
        // `cdk diff` won't read this env value but `cdk deploy` will. 
        // should hardcode string when using `cdk diff`
        account: process.env.AWS_ACCOUNT_NUMBER, 
        region: 'us-west-2'
    },
    tnb: {
        validatorName: 'test-validator',
        bankName: 'test-bank',
        amiImageSearchTerm: 'ubuntu*20.04-amd64-server*'
    },
    startupCommands: {
        bank: [ // WIP
            `sudo add-apt-repository universe`,
            `sudo apt -y update && sudo apt -y upgrade`,
            `sudo apt -y install build-essential nginx python3-pip redis-server`,
            `sudo ufw app list`,
            `sudo ufw allow 'Nginx Full' && sudo ufw allow OpenSSH && sudo ufw enable`,
            `sudo useradd -p $(openssl passwd -1 ${process.env.EC2_USER_PASSWORD || '5oMePa55woRd'}) deploy`,
            `sudo bash -c "echo '%deploy ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers"`,
            `sudo chmod go+w /var/www`,
            `git clone https://github.com/thenewboston-developers/Bank.git /var/www/Bank`,
            `cd /var/www/Bank/`,
            `sudo apt-get install libpq-dev python-dev gcc -y`,
            `sudo pip3 install -r requirements/production.txt`,
            `sudo rm /etc/nginx/sites-available/default`  
        ]
    }
}