const statusBar = document.getElementById('gameStatus');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');
const saveSettingsBtn = document.getElementById('saveSettings');

const setStatus = (message) => {
  if (statusBar) {
    statusBar.textContent = message;
  }
};

const fallbackLeagueData = {
  league: 'Süper Lig',
  teams: []
};

const loadLeagueData = async () => {
  try {
    const response = await fetch('./database/superlig-data.json');
    if (!response.ok) {
      throw new Error('Veri dosyası okunamadı.');
    }

    const data = await response.json();
    window.gameData = data;
    setStatus('Süper Lig verisi yüklendi');
    return data;
  } catch (error) {
    console.warn('JSON verisi yüklenemedi, yedek veri kullanıldı.', error);
    window.gameData = fallbackLeagueData;
    setStatus('Football Life');
    return fallbackLeagueData;
  }
};

document.querySelectorAll('.menu-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;

    if (action === 'play') {
      setStatus('Oyun başlıyor... saha hazır!');
      button.disabled = true;
      setTimeout(() => {
        button.disabled = false;
      }, 600);
    }

    if (action === 'settings') {
      settingsModal.classList.remove('hidden');
      settingsModal.setAttribute('aria-hidden', 'false');
      setStatus('Ayarlar menüsü açık.');
    }

    if (action === 'quit') {
      const shouldQuit = window.confirm('Oyundan çıkmak istediğine emin misin?');
      if (shouldQuit) {
        setStatus('Oyun kapatıldı.');
        document.body.style.filter = 'grayscale(0.2)';
        setTimeout(() => {
          if (window.close) {
            window.close();
          }
        }, 400);
      } else {
        setStatus('Çıkış iptal edildi.');
      }
    }
  });
});

if (closeSettingsBtn) {
  closeSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    settingsModal.setAttribute('aria-hidden', 'true');
    setStatus('Ayarlar kapatıldı.');
  });
}

if (saveSettingsBtn) {
  saveSettingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
    settingsModal.setAttribute('aria-hidden', 'true');
    setStatus('Ayarlar kaydedildi.');
  });
}

if (settingsModal) {
  settingsModal.addEventListener('click', (event) => {
    if (event.target === settingsModal) {
      settingsModal.classList.add('hidden');
      settingsModal.setAttribute('aria-hidden', 'true');
    }
  });
}

loadLeagueData();
