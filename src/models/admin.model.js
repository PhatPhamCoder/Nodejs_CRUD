const Admin = function (admin) {
  (this.name = admin.name),
    (this.password = admin.password),
    (this.email = admin.email),
    (this.account = admin.account),
    (this.type = admin.type),
    (this.role_id = admin.role_id),
    (this.refresh_token = admin.refresh_token),
    (this.OTP = admin.OTP),
    (this.active = admin.active),
    (this.expired_on = admin.expired_on),
    (this.created_at = admin.created_at),
    (this.updated_at = admin.updated_at);
};

module.exports = Admin;
