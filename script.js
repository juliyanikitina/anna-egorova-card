const hero = document.querySelector('#hero');
const saveContact = document.querySelector('#save-contact');
const contactModal = document.querySelector('#contact-modal');
const closeContactModal = document.querySelector('#close-contact-modal');
const downloadContact = document.querySelector('#download-contact');
const modalHelp = document.querySelector('#modal-help');

if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * -12;
    const y = (event.clientY / window.innerHeight - 0.5) * -8;
    hero.style.setProperty('--mx', `${x}px`);
    hero.style.setProperty('--my', `${y}px`);
  });
}

if (saveContact) {
  saveContact.addEventListener('click', (event) => {
    event.preventDefault();
    if (contactModal?.showModal) {
      contactModal.showModal();
    } else if (contactModal) {
      contactModal.setAttribute('open', '');
    }
  });
}

closeContactModal?.addEventListener('click', () => contactModal.close());

contactModal?.addEventListener('click', (event) => {
  if (event.target === contactModal) contactModal.close();
});

async function createContactPhoto() {
  const image = new Image();
  image.src = 'assets/anna-red-dress.webp';
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 480;
  const context = canvas.getContext('2d');
  context.drawImage(image, 420, 80, 800, 800, 0, 0, 480, 480);
  return canvas.toDataURL('image/jpeg', .84).split(',')[1];
}

function foldBase64(value) {
  const chunks = value.match(/.{1,72}/g) || [];
  return chunks.join('\r\n ');
}

downloadContact?.addEventListener('click', async () => {
  downloadContact.setAttribute('aria-busy', 'true');
  modalHelp.textContent = 'Готовим контакт с фотографией…';

  try {
    const photo = await createContactPhoto();
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N;CHARSET=UTF-8:Егорова;Анна;Александровна;;',
      'FN;CHARSET=UTF-8:Анна Егорова',
      'ORG;CHARSET=UTF-8:Альфа-Банк',
      'TITLE;CHARSET=UTF-8:Руководитель направления факторинг по Сибири и Дальнему Востоку',
      'TEL;TYPE=CELL,VOICE:+79132511525',
      'EMAIL;TYPE=INTERNET,WORK:aegorova25@alfabank.ru',
      'URL;TYPE=WORK:https://anna-egorova.tuqo.ru/',
      `PHOTO;ENCODING=b;TYPE=JPEG:${foldBase64(photo)}`,
      'REV:20261009T000000Z',
      'END:VCARD',
      ''
    ];
    const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const download = document.createElement('a');

    download.href = objectUrl;
    download.download = 'Anna-Egorova.vcf';
    document.body.append(download);
    download.click();
    download.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
    modalHelp.textContent = 'Файл скачан. Откройте его и подтвердите добавление контакта.';
  } catch {
    modalHelp.textContent = 'Не удалось подготовить контакт. Попробуйте ещё раз.';
  } finally {
    downloadContact.removeAttribute('aria-busy');
  }
});
