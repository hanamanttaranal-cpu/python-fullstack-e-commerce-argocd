pipeline {
    agent any

    stages {

        stage('Git Checkout') {
            steps {
                git branch: 'main', credentialsId: 'git-checkout', url: 'https://github.com/hanamanttaranal-cpu/python-fullstack-e-commerce-argocd.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install --upgrade pip
                        pip install -r requirements.txt
                    '''
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh 'trivy fs --scanners vuln --exit-code 0 .'
            }
        }

        stage('Docker Build & Run') {
            steps {
                sh '''
                    docker compose up --build -d || sudo docker compose up --build -d
                '''
            }
        }
    }
}

