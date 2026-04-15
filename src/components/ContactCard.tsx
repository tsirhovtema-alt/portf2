'use client';

import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  .flip-card {
    background-color: transparent;
    width: 300px;
    height: 192px;
    perspective: 1000px;
    color: white;
    flex-shrink: 0;
  }

  .heading_8264 {
    position: absolute;
    letter-spacing: .2em;
    font-size: 0.55em;
    top: 2em;
    left: 20.5em;
    font-family: monospace;
    font-weight: 700;
  }

  .logo {
    position: absolute;
    top: 6.8em;
    left: 11.7em;
  }

  .chip {
    position: absolute;
    top: 2.3em;
    left: 1.5em;
  }

  .contactless {
    position: absolute;
    top: 3.5em;
    left: 12.4em;
  }

  .number {
    position: absolute;
    font-weight: bold;
    font-size: .65em;
    top: 8.3em;
    left: 1.6em;
    font-family: monospace;
    letter-spacing: 0.1em;
  }

  .valid_thru {
    position: absolute;
    font-weight: bold;
    top: 635.8em;
    font-size: .01em;
    left: 140.3em;
  }

  .date_8264 {
    position: absolute;
    font-weight: bold;
    font-size: 0.5em;
    top: 13.6em;
    left: 3.2em;
    font-family: monospace;
  }

  .name {
    position: absolute;
    font-weight: bold;
    font-size: 0.55em;
    top: 16.1em;
    left: 2em;
    letter-spacing: 0.1em;
    font-family: monospace;
  }

  .strip {
    position: absolute;
    background-color: black;
    width: 100%;
    height: 1.5em;
    top: 2.4em;
    background: repeating-linear-gradient(
      45deg,
      #303030,
      #303030 10px,
      #202020 10px,
      #202020 20px
    );
  }

  .mstrip {
    position: absolute;
    background-color: rgb(255, 255, 255);
    width: 8em;
    height: 0.8em;
    top: 5em;
    left: .8em;
    border-radius: 2.5px;
  }

  .sstrip {
    position: absolute;
    background-color: rgb(255, 255, 255);
    width: 4.1em;
    height: 0.8em;
    top: 5em;
    left: 10em;
    border-radius: 2.5px;
  }

  .code {
    font-weight: bold;
    text-align: center;
    margin: .2em;
    color: black;
    font-size: 0.85em;
  }

  .back-info {
    position: absolute;
    bottom: 1.5em;
    left: 1.5em;
    font-size: 0.5em;
    color: rgba(255,255,255,0.5);
    font-family: monospace;
    letter-spacing: 0.05em;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front,
  .flip-card-back {
    box-shadow: 0 8px 14px 0 rgba(0,0,0,0.2);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 1rem;
  }

  .flip-card-front {
    box-shadow:
      rgba(0, 0, 0, 0.4) 0px 2px 2px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -1px 0px inset,
      0 0 30px rgba(124, 58, 237, 0.2);
    background: linear-gradient(135deg, #1a0533 0%, #0d1a33 50%, #0a1a2a 100%);
    border: 1px solid rgba(124, 58, 237, 0.3);
  }

  .flip-card-back {
    box-shadow:
      rgba(0, 0, 0, 0.4) 0px 2px 2px,
      rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
      rgba(0, 0, 0, 0.2) 0px -1px 0px inset;
    background: linear-gradient(135deg, #0d1a33 0%, #1a0533 100%);
    transform: rotateY(180deg);
    border: 1px solid rgba(6, 182, 212, 0.2);
  }

  .accent-dot {
    position: absolute;
    top: 1.2em;
    left: 1.5em;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #7c3aed;
    box-shadow: 0 0 10px #7c3aed;
  }

  .role-badge {
    position: absolute;
    top: 1em;
    right: 1.5em;
    font-size: 0.42em;
    font-family: monospace;
    color: rgba(6, 182, 212, 0.8);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`;

export default function ContactCard() {
  return (
    <StyledWrapper>
      <div className="flip-card" data-cursor="pointer">
        <div className="flip-card-inner">
          {/* FRONT */}
          <div className="flip-card-front">
            <div className="accent-dot" />
            <p className="role-badge">FULLSTACK DEV</p>

            {/* Chip SVG */}
            <svg className="chip" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 50 50">
              <image id="image0" width={50} height={50} x={0} y={0} href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSeUWYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbtnaafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCET amiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg==" />
            </svg>

            {/* Contactless */}
            <svg className="contactless" version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50">
              <image id="image0" width={50} height={50} x={0} y={0} href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQflGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/FfPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xNGQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49itVoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJkHpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15zbkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFAsR8zTzfOMgeSZGfgPMlrMciBf4c3lRFEHEiiRfS4GHkQq8Qf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFAsR8zTzfOMgeSZGfgPMlrMciBf4c3lRFEHEiiRfS4GHkQq8Qf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFAsR8zTzfOMgeSZGfgPMlrMciBf4c3lRFEHEiiRfS4GHkQq8Qf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFAsR8zTzfOMgeSZGfgPMlrMciBf4c3lRFEHEiiRfS4GHkQq8Qf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFASQ== " />
            </svg>

            {/* Gradient logo circles (instead of Mastercard) */}
            <svg className="logo" xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 48 48">
              <circle cx="32" cy="24" r="14" fill="#7c3aed" opacity="0.9" />
              <circle cx="16" cy="24" r="14" fill="#06b6d4" opacity="0.9" />
              <ellipse cx="24" cy="24" rx="6" ry="14" fill="#8b5cf6" opacity="0.8" />
            </svg>

            <p className="number">ALEX · DEV · 2024</p>
            <p className="valid_thru">ДЕЙСТВУЕТ ДО</p>
            <p className="date_8264">∞ / ∞</p>
            <p className="name">FULLSTACK DEVELOPER</p>
          </div>

          {/* BACK */}
          <div className="flip-card-back">
            <div className="strip" />
            <div className="mstrip" />
            <div className="sstrip">
              <p className="code">DEV</p>
            </div>
            <p className="back-info">hello@alexdev.io · alexdev.io</p>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}
