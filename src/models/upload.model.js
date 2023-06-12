const Image = function (image) {
  (this.file_src = image.file_src),
    (this.created_at = image.created_at),
    (this.updated_at = image.updated_at);
};

module.exports = Image;
