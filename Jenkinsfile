pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "elise259/td-devops"
        DOCKER_TAG   = "latest"
    }

    stages {

        // -----------------------------
        stage('Install & Test') {
            steps {
                sh 'npm ci'
                echo "Skipping tests"
            }
        }

        // -----------------------------
        stage('Build Docker Image') {
            steps {
                sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
                sh "docker images"
            }
        }

        // -----------------------------
        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry(credentialsId: 'dockerhub-creds', url: '') {
                    sh "docker push $DOCKER_IMAGE:$DOCKER_TAG"
                }
            }
        }

        // -----------------------------
        stage('Create Docker Secret') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds', 
                    usernameVariable: 'DOCKER_USER', 
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        sh '''
                        if ! kubectl get secret dockerhub-creds --kubeconfig=$KUBECONFIG >/dev/null 2>&1; then
                            kubectl create secret docker-registry dockerhub-creds \
                                --docker-username=$DOCKER_USER \
                                --docker-password=$DOCKER_PASS \
                                --docker-server=https://index.docker.io/v1/ \
                                --kubeconfig=$KUBECONFIG
                            echo "Docker secret created."
                        else
                            echo "Docker secret already exists."
                        fi
                        '''
                    }
                }
            }
        }

        // -----------------------------
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    sh 'kubectl apply -f k8s-deployment.yaml --kubeconfig=$KUBECONFIG'
                    sh 'kubectl rollout status deployment tp-devops --kubeconfig=$KUBECONFIG'
                }
            }
        }

    } // end stages

    // -----------------------------
    post {
        success {
            echo "Deployment successful!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
