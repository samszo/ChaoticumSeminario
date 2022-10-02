const btnFullScreen = document.getElementById('btnFullScreen')
const AleaDiapo = document.getElementById('aleaDiapo')

const toggleFullScreen = () =>
{
    AleaDiapo.requestFullscreen()
}
btnFullScreen.addEventListener('click',toggleFullScreen)