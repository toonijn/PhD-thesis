function resize() {
  const invite = document.getElementById("invite");
  invite.style.setProperty("--scale", 1);
  const scaling =
    0.95 *
    Math.min(
      window.innerWidth / invite.offsetWidth,
      window.innerHeight / invite.offsetHeight
    );
  invite.style.setProperty("--scale", scaling);
}

window.addEventListener("load", resize);
window.addEventListener("resize", resize);
