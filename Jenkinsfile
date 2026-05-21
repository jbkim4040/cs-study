pipeline {
    agent any

    environment {
        APP_SERVER = "ubuntu@140.245.74.59"
        DEPLOY_DIR = "/home/ubuntu/cs-study-src"
        WEB_DIR    = "/home/ubuntu/cs-study/dist"
        REPO       = "https://github.com/jbkim4040/cs-study.git"
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "✅ 소스 체크아웃 완료"
            }
        }

        stage('소스 동기화 (WAS)') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no $APP_SERVER \
                      "if [ -d $DEPLOY_DIR/.git ]; then \
                          cd $DEPLOY_DIR && git fetch origin && git reset --hard origin/main; \
                       else \
                          git clone $REPO $DEPLOY_DIR; \
                       fi"
                '''
                echo "✅ WAS 서버 소스 동기화 완료"
            }
        }

        stage('빌드') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no $APP_SERVER \
                      "docker run --rm -v $DEPLOY_DIR:/app -w /app node:20-alpine sh -c 'npm ci && npm run build'"
                '''
                echo "✅ Vite 빌드 완료"
            }
        }

        stage('배포') {
            steps {
                sh '''
                    ssh -o StrictHostKeyChecking=no $APP_SERVER \
                      "mkdir -p $WEB_DIR && rm -rf $WEB_DIR/* && cp -r $DEPLOY_DIR/dist/. $WEB_DIR/"
                '''
                echo "✅ 정적 파일 배포 완료 — cs-study 컨테이너가 즉시 서빙"
            }
        }

        stage('검증') {
            steps {
                sh '''
                    sleep 2
                    ssh -o StrictHostKeyChecking=no $APP_SERVER \
                      "docker exec nginx wget -qO- http://cs-study/ | grep -q 'CS Study' && echo '검증 OK' || (echo '검증 실패' && exit 1)"
                '''
            }
        }
    }

    post {
        success { echo '🎉 cs-study 배포 성공 — https://jbdatahub.com/cs-study/' }
        failure { echo '❌ cs-study 배포 실패 — 빌드 로그 확인 필요' }
    }
}
