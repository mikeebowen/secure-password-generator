// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'
const copy = document.getElementById('copy');
const form = document.getElementById('pw-form');

if (copy) {
  copy.onclick = async function(e: Event): Promise<void> {
    e.preventDefault();
    const result = await navigator.permissions.query({name: 'clipboard-write' as PermissionName})
      if (result.state == 'granted' || result.state == 'prompt') {
        /* write to the clipboard now */
        const outputSpan: HTMLElement | null = document.getElementById('pw');
        if (outputSpan) {
          await navigator.clipboard.writeText(outputSpan.innerText);
        }
      }
  }
}
if (form) {
  form.onclick = function (e: Event): void {
    e.preventDefault();
    const specialChars = '!@#$%^&*';
    const numbers = '0123456789';
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let pw = '';

    const numInput = document.getElementById('numbers') as HTMLInputElement;
    const count = document.getElementById('count') as HTMLInputElement;
    const outputSpan: HTMLElement | null = document.getElementById('pw');
    let rounds: number = parseInt(count.value);
    rounds = isNaN(rounds) ? 6 : rounds;

    if (numInput.checked) {
      chars += numbers;
    }

    const specials: NodeListOf<HTMLInputElement> = document.getElementsByName('special-chars') as NodeListOf<HTMLInputElement>;
    let xtraChars: string[] = [];

    specials.forEach(s => {
      if (s.checked){
        xtraChars.push(s.value);
      }
    });

    chars += xtraChars.join('');

    for (let i = 0; i < rounds; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    if (numInput.checked || specials.length) {
      const strArr: string[] = pw.split('');
      let numIndex: number = Math.floor(Math.random() * strArr.length);
      let specialIndex: number = Math.floor(Math.random() * strArr.length);

      while(numIndex === specialIndex) {
        numIndex = Math.floor(Math.random() * strArr.length);
        specialIndex = Math.floor(Math.random() * strArr.length);
      }

      if (numInput.checked) {
        strArr[numIndex] = numbers[Math.floor(Math.random() * numbers.length)];
      }
      if (xtraChars.length) {
        strArr[specialIndex] = xtraChars[Math.floor(Math.random() * xtraChars.length)];
      }

      pw = strArr.join('');
    }

    if (outputSpan) {
      if (copy) {
        copy.style.visibility = 'visible';
      }
      outputSpan.innerText = pw;
    }
  }
}

