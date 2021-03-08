const gulp = require("gulp");
const sftp = require("gulp-sftp-up4");

const develop = {
  //正式服务器
  host: "101.200.217.19",
  pass: "MallPlatform@20201125",
  user: "root",
  port: 22,
  remotePath: "/docker/nginx/html/",
  timeout: 10000000,
};

gulp.task("upload", function () {
  return gulp.src("dist/**").pipe(sftp(develop));
});
