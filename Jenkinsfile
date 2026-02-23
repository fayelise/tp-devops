pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "elise259/td-devops"
        DOCKER_TAG = "latest"
        KUBE_CONFIG = credentials('kubeconfig')
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/fayelise/td-devops.git'
            }
        }

        stage('Install & Test') {
            steps {
                sh 'npm install'
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry(
                    credentialsId: 'dockerhub-creds',
                    url: ''
                ) {
                    sh "docker push $DOCKER_IMAGE:$DOCKER_TAG"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f k8s-deployment.yaml"
            }
        }
    }

    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
