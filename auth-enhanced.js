const bcrypt = dcodeIO.bcrypt;

async function login(username, password) {
  const hashedPassword = localStorage.getItem("hashedPassword");
  
  if (username === ADMIN_USERNAME && bcrypt.compareSync(password, hashedPassword)) {
    localStorage.setItem("isAdmin", "true");
    toast("Đăng nhập thành công!");
    location.reload();
  } else {
    toast("Sai tài khoản hoặc mật khẩu!");
  }
}

function setAdminPassword(password) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  localStorage.setItem("hashedPassword", hashedPassword);
}

// Gọi hàm này một lần để lưu mật khẩu mã hóa
setAdminPassword("motyeu01.");