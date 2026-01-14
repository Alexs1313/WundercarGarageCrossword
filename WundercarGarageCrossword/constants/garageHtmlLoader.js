export const garageHtmlLoader = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .loader {
        width: 48px;
        height: 48px;
        background: #353535;
        position: relative;
        box-sizing: border-box;
        animation: rotationBack 1s ease-in-out infinite reverse;
      }

      .loader::before {
        content: '';
        position: absolute;
        inset: 0;
        background: #2e2e2e;
        transform: rotate(45deg);
        box-shadow: 0 0 5px rgba(0,0,0,0.15);
      }

      .loader::after {
        content: '';
        width: 32px;
        height: 32px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        background: #000;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 5px rgba(0,0,0,0.15);
      }

      @keyframes rotationBack {
        from { transform: rotate(0deg); }
        to { transform: rotate(-360deg); }
      }
    </style>
  </head>

  <body>
    <div class="loader"></div>
  </body>
</html>
`;
