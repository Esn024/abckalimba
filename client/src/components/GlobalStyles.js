import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :root {
    --color-cadmium-red: #D80026;
    --color-alabama-crimson: #AA001E;
    --color-dark-green: #3FB07C;
    --color-very-light-green: #e2fdf1;
    --color-dark-grey: #5c5c5c;
    --color-orange: #F79D00;
    --color-selective-yellow: #FDBB01;
    --color-desert-sand: #E3C4A6;
    --font-heading: 'Permanent Marker', Arial, Helvetica, sans-serif;
    --font-body: 'Kosugi', Arial, Helvetica, sans-serif;
    --padding-page: 24px;
    --font-size-big: 24px;
    --font-size-medium: 20px;
    --font-size-small: 16px;
  }

  /* http://meyerweb.com/eric/tools/css/reset/
      v2.0 | 20110126
      License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
      font-size: 100%;
      vertical-align: baseline;
      font-family: Roboto, Arial, sans-serif;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
      display: block;
  }
  body {
      line-height: 1;
  }
  ol, ul {
      list-style: none;
  }
  blockquote, q {
      quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
      content: '';
      content: none;
  }

  h1,
h2,
h3,
label {
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-big);
  text-align: center;
  transition: all 0.2s;
}

button {
  color: var(--color-alabama-crimson);
  font-family: var(--font-heading);
  font-size: var(--font-size-small);
  text-align: center;
  
  /* border: none; */
  /* outline: none; */
  text-decoration: none;
  /* transition: color 0.2s; */
}

p,
a,
li,
blockquote,
input {
  font-family: var(--font-body);
}

button:hover,
a:hover {
  color: var(--color-orange);
  transition: color 0.2s;
}

  input {
    font-size: var(--font-size-medium);
    height: 20px;
    border: 1px solid black;
    padding: 1px 2px;
    font-size: var(--font-size-small);
  }
  /* music-specific styles */
  .abcjs-cursor {
    stroke: red;
  }
  .abcjs-rest {
    opacity: 0.1;
  }
  .color {
      stroke: red;
      fill: red;
    }
  .active-tine {
    background-color: var(--color-dark-green);
    border: 1px solid var(--color-dark-grey);
    border-radius: 5px;
  }
  
  .timed-note {
    width: 30px;
    height:30px;
  }
  .note-grid-row {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

`;
