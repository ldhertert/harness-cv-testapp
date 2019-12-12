(cd ../ && ./build.sh)
TEMP_DIR=$(mktemp -d)
unzip ../../dist/harness-cv-testapp.1.0.2.zip -d $TEMP_DIR/
cp ./manifest.yml $TEMP_DIR
(cd $TEMP_DIR && cf push)
rm -rf $TEMP_DIR