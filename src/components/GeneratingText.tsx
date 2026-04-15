'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const transformAnim = keyframes`
  0%   { transform: translate(-55%); }
  100% { transform: translate(55%); }
`;

const opacityAnim = keyframes`
  0%, 100% { opacity: 0; }
  15%       { opacity: 1; }
  65%       { opacity: 0; }
`;

const letterAnim = keyframes`
  0%  { opacity: 0; }
  5%  {
    opacity: 1;
    text-shadow: 0 0 4px #fff;
    transform: scale(1.1) translateY(-2px);
  }
  20% { opacity: 0.2; }
  100%{ opacity: 0; }
`;

const LoaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  width: auto;
  padding: 0 1.5rem;
  font-family: "Poppins", "Inter", sans-serif;
  font-size: 1.1em;
  font-weight: 600;
  user-select: none;
  color: #fff;
`;

const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  background-color: transparent;
  mask: repeating-linear-gradient(
    90deg,
    transparent 0,
    transparent 6px,
    black 7px,
    black 8px
  );

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at 50% 50%, #7c3aed 0%, transparent 50%),
      radial-gradient(circle at 45% 45%, #06b6d4 0%, transparent 45%),
      radial-gradient(circle at 55% 55%, #f59e0b 0%, transparent 45%),
      radial-gradient(circle at 45% 55%, #8b5cf6 0%, transparent 45%),
      radial-gradient(circle at 55% 45%, #06b6d4 0%, transparent 45%);
    mask: radial-gradient(
      circle at 50% 50%,
      transparent 0%,
      transparent 10%,
      black 25%
    );
    animation:
      ${transformAnim} 2s infinite alternate,
      ${opacityAnim} 4s infinite;
    animation-timing-function: cubic-bezier(0.6, 0.8, 0.5, 1);
  }
`;

const Letter = styled.span<{ $delay: number }>`
  display: inline-block;
  opacity: 0;
  animation: ${letterAnim} 4s infinite linear;
  animation-delay: ${({ $delay }) => $delay}s;
  z-index: 2;
`;

const WORD = 'Разработка';
const BASE_DELAY = 0.1;
const STEP = 0.105;

export default function GeneratingText() {
  return (
    <LoaderWrapper>
      {WORD.split('').map((char, i) => (
        <Letter key={i} $delay={BASE_DELAY + i * STEP}>
          {char}
        </Letter>
      ))}
      <Loader />
    </LoaderWrapper>
  );
}
