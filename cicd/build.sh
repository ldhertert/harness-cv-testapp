rm -rf ../dist
mkdir ../dist

VERSION=$(cat ../package.json | jq -r '.version')
FILE="harness-cv-testapp.${VERSION}.zip"
(cd ../ && zip -r "./dist/$FILE" ./package.json ./src)

#aws s3 cp "../dist/$FILE" s3://harness-se-artifacts/harness-cv-testapp/ --acl public-read
#curl -v -u admin:replace_this --upload-file pom.xml http://localhost:8081/repository/maven-releases/org/foo/1.0/foo-1.0.pom