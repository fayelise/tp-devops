pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "elise259/td-devops"
        DOCKER_TAG = "latest"
    }

    stages {
        stage('Install & Test') {
            steps {
                sh 'npm ci'
                echo "Skipping tests"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
                sh 'docker images'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-creds') {
                        docker.image("$DOCKER_IMAGE:$DOCKER_TAG").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s-deployment.yaml --kubeconfig=$KUBECONFIG'
                    sh 'kubectl rollout status deployment tp-devops --kubeconfig=$KUBECONFIG'
                }
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
