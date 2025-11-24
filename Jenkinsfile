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
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    stages {

        stage('Checkout from Bitbucket') {
            steps {
                echo "Checking out repository..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        script {
                            echo "Building backend Docker image..."
                            dir('backend') {
                                sh """
                                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                                 -t ${BACKEND_IMAGE}:latest1 .
                                """
                            }
                        }
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        script {
                            echo "Building frontend Docker image..."
                            dir('frontend') {
                                sh """
                                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                                 -t ${FRONTEND_IMAGE}:latest2 .
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
                    echo "Logging into Docker Hub..."
                    sh """
                        echo \$DOCKERHUB_CREDENTIALS_PSW | docker login \
                            -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin
                    """

                    echo "Pushing backend image..."
                    sh """
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest1
                    """

                    echo "Pushing frontend image..."
                    sh """
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest2
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up Docker images on Jenkins node..."
            sh """
                docker rmi ${BACKEND_IMAGE}:${IMAGE_TAG} || true
                docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                docker logout || true
            """
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
