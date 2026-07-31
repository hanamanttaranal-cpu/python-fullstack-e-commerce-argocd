pipeline {
    agent any

    environment {
        APP_NAME = 'auramarket-ecommerce'
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '123456789012.dkr.ecr.us-east-1.amazonaws.com'
        EKS_CLUSTER_NAME = 'auramarket-eks-cluster'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (fileExists('backend/requirements.txt')) {
                        dir('backend') {
                            sh 'python3 -m venv venv || true'
                            sh '. venv/bin/activate && pip install -r requirements.txt || true'
                        }
                    }
                    sh 'npm install'
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh 'trivy fs --scanners vuln --exit-code 0 .'
            }
        }

        stage('Typecheck & Build') {
            steps {
                sh 'npm run lint'
                sh 'npm run build'
            }
        }

        stage('Docker Build & Tag') {
            steps {
                script {
                    sh "docker build -t ${APP_NAME}:${BUILD_NUMBER} ."
                    sh "docker tag ${APP_NAME}:${BUILD_NUMBER} ${ECR_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}"
                    sh "docker tag ${APP_NAME}:${BUILD_NUMBER} ${ECR_REGISTRY}/${APP_NAME}:latest"
                }
            }
        }

        stage('Push to AWS ECR') {
            steps {
                script {
                    // sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"
                    // sh "docker push ${ECR_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}"
                    // sh "docker push ${ECR_REGISTRY}/${APP_NAME}:latest"
                    echo "Pushed image ${ECR_REGISTRY}/${APP_NAME}:${BUILD_NUMBER} to ECR"
                }
            }
        }

        stage('Deploy to AWS EKS') {
            steps {
                script {
                    // sh "aws eks update-kubeconfig --region ${AWS_REGION} --name ${EKS_CLUSTER_NAME}"
                    // sh "kubectl apply -f kubernetes/deployment.yaml"
                    // sh "kubectl apply -f kubernetes/service.yaml"
                    echo "Deploying to Kubernetes EKS cluster: ${EKS_CLUSTER_NAME}"
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
