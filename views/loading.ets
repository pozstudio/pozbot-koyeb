<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Bot Başlatılıyor...</title>
  <style>
    body {
      background: #000;
      color: white;
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .loader {
      text-align: center;
    }
    .loader h1 {
      font-size: 24px;
    }
    .dots::after {
      content: '';
      animation: dots 1s infinite steps(3);
    }
    @keyframes dots {
      0% { content: '.'; }
      33% { content: '..'; }
      66% { content: '...'; }
    }
  </style>
  <script>
    setTimeout(() => {
      window.location.href = '/panel';
    }, 3000);
  </script>
</head>
<body>
  <div class="loader">
    <h1>Bot başlatılıyor<span class="dots"></span></h1>
  </div>
</body>
</html>
