pipeline {
    agent any

    environment {
        // Docker Hub credentials (configure in Jenkins credentials)
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = 'naga2112'

        // Docker image names and tags
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/erp-crm-backend-harness"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/erp-crm-frontend-harness"
        IMAGE_TAG = "${BUILD_NUMBER}"

        // VMware deployment credentials and details
        VMWARE_HOST = credentials('vmware-host')
        VMWARE_CREDENTIALS = credentials('vmware-ssh-credentials')
        DEPLOY_PATH = '/opt/erp-crm-app'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Checkout from Bitbucket') {
            steps {
                script {
                    echo 'Checking out code from Bitbucket...'
                    // For Bitbucket, configure the repository URL in Jenkins
                    checkout scm
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            echo 'Building backend Docker image...'
                            dir('backend') {
                                sh """
                                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                        -t ${BACKEND_IMAGE}:latest1 \
                                        -f Dockerfile .
                                """
                            }
                        }
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo 'Building frontend Docker image...'
                            dir('frontend') {
                                sh """
                                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                        -t ${FRONTEND_IMAGE}:latest2 \
                                        -f Dockerfile .
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Logging into Docker Hub...'
                    sh """
                        echo \$DOCKERHUB_CREDENTIALS_PSW | docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin
                    """

                    echo 'Pushing backend image...'
                    sh """
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest1
                    """

                    echo 'Pushing frontend image...'
                    sh """
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest2
                    """
                }
            }
        }

        stage('Deploy to VMware') {
            steps {
                script {
                    echo 'Deploying to VMware...'

                    // Copy docker-compose file to VMware host
                    sshagent(['vmware-ssh-credentials']) {
                        sh """
                            # Create deployment directory on VMware host
                            ssh -o StrictHostKeyChecking=no ${VMWARE_CREDENTIALS_USR}@${VMWARE_HOST} \
                                "mkdir -p ${DEPLOY_PATH}"
                            # Copy docker-compose production file
                            scp -o StrictHostKeyChecking=no docker-compose.prod.yml \
                                ${VMWARE_CREDENTIALS_USR}@${VMWARE_HOST}:${DEPLOY_PATH}/docker-compose.yml
                            # Deploy on VMware using docker-compose
                            ssh -o StrictHostKeyChecking=no ${VMWARE_CREDENTIALS_USR}@${VMWARE_HOST} \
                                "cd ${DEPLOY_PATH} && \
                                docker-compose pull && \
                                docker-compose down && \
                                docker-compose up -d && \
                                docker-compose ps"
                        """
                    }
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo 'Performing health check...'
                    sshagent(['vmware-ssh-credentials']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${VMWARE_CREDENTIALS_USR}@${VMWARE_HOST} \
                                "cd ${DEPLOY_PATH} && docker-compose ps"
                        """
                    }

                    echo 'Waiting for services to be ready...'
                    sleep(time: 30, unit: 'SECONDS')

                    // Optional: Add curl commands to check if services are responding
                    echo 'Application deployed successfully!'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker images on Jenkins agent...'
            sh """
                docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG} || true
                docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                docker logout
            """
        }
        success {
            echo 'Pipeline completed successfully!'
            // You can add notifications here (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // You can add failure notifications here
        }
    }
}