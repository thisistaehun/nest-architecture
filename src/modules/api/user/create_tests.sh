SRC_DIR="./src/modules/api/user"

find "$SRC_DIR" -type f -name "*.ts" ! -path "$SRC_DIR/__test__/*" ! -name "*.module.ts" ! -name "*.resolver.ts" ! -name "*.service.ts" | while read ts_file; do
  spec_file="${ts_file/.ts/.spec.ts}"
  spec_file="${spec_file//$SRC_DIR/$SRC_DIR/__test__}"
  spec_dir=$(dirname "$spec_file")

  mkdir -p "$spec_dir"
  touch "$spec_file"
  echo "Created test file: $spec_file"
done
