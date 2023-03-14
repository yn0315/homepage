function password_keyup() {

    let $pw1 = document.getElementById('input_password');
    let $pw2 = document.getElementById('confirm_password');
    
    const $cor = document.getElementById('correct');
    const $incor = document.getElementById('incorrect');
    console.log($pw2.val);
    
    if ($pw1.val == $pw2.val) { //일치하면
        console.log('correct!!!!!!');
        $cor.style.className = "";
        $incor.style.display = 'none';
    } else if(($pw1.val != $pw2.val)){ //불일치하면
        console.log('incorrect!!!!!!');
        $incor.style.className = "";
        $cor.style.className = "invisible";

    }
    
};


$('#menu-trigger').on('click', function (e) {
    {
        // e.preventDefault();
        const $hamburgerMenu = document.getElementById('ham_inner_header');
        if ($hamburgerMenu.className === "invisible") {
            $hamburgerMenu.className = "visible";
            // $hamburgerMenu.style.width = '220px';

        } else {
            $hamburgerMenu.className = "invisible";
        }
        // $hamburgerMenu.classList.toggle = "invisible";
        // $hamburgerMenu.style.display="inline-block";

    }
})