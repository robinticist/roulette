'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface RouletteProps {
  items: number[];
  onSpinStart?: () => Promise<number>;
  onSpinEnd?: (value: number) => void;
  disabled?: boolean;
  remainSecond?: number; // timestamp
  // 크기 커스터마이징 옵션
  width?: string; // 룰렛 너비
  height?: string; // 룰렛 높이
  // 색상 커스터마이징 옵션
  outerBorderColor?: string; // 외부 테두리 색상
  dotColor?: string; // 노란 점 색상
  dotBorderColor?: string; // 노란 점 테두리 색상
  markerColor?: string; // 화살표 마커 색상
  buttonBorderColor?: string; // 중앙 버튼 테두리 색상
  buttonBgColor?: string; // 중앙 버튼 배경 색상
  buttonHoverBorderColor?: string; // 중앙 버튼 호버 테두리 색상
  buttonHoverBgColor?: string; // 중앙 버튼 호버 배경 색상
  buttonDisabledBgColor?: string; // 중앙 버튼 활성화 배경 색상
  sectionColors?: [string, string]; // 섹션 배경 색상 [홀수 인덱스 색상, 짝수 인덱스 색상]
  textColor?: string; // 텍스트 색상
}

export default function Roulette({
  items,
  onSpinStart,
  onSpinEnd,
  disabled = false,
  remainSecond = 0,
  // 크기 커스터마이징 기본값
  width = '330px',
  height = '330px',
  // 색상 커스터마이징 기본값
  outerBorderColor = '#e12afb',
  dotColor = '#ffdf20',
  dotBorderColor = '#9ca3af',
  markerColor = '#F44225',
  buttonBorderColor = '#f87171',
  buttonBgColor = '#ff4d4d',
  buttonHoverBorderColor = '#ef4444',
  buttonHoverBgColor = '#dc2626',
  buttonDisabledBgColor = '#b91c1c',
  sectionColors = ['#ffffff', '#e5e7eb'],
  textColor = '#000000',
}: RouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [markerRotation, setMarkerRotation] = useState(0);
  const markerRef = useRef<HTMLDivElement>(null);
  const count = useRef(1);
  const prevWinningIndex = useRef(0);

  const spinSpeed = 5; // seconds

  const spin = useCallback(async () => {
    if (isSpinning || disabled) return;

    try {
      const winningIndex = (await onSpinStart?.()) ?? 0;
      setIsSpinning(true);

      const baseRotation = 360 * 5; // 기본 회전 수
      const itemAngle = 360 / items.length; // 각 섹션의 각도

      // 현재 회전 상태에서 목표 위치까지의 각도 계산
      // 이 값은 현재 회전각에 추가되어 루렛이 어느 정도로 회전할지 결정함
      let targetRotation = 0;

      // 화살표가 섹션의 중앙에 멈추도록 각도 계산
      // 각 섹션의 중앙에 화살표가 정확히 위치하도록 하기 위한 오프셋 값
      const sectionMiddleOffset = itemAngle / 2;

      if (count.current === 1) {
        // 360도에서 당첨 섹션의 중앙 각도를 빼서 화살표가 정확히 중앙에 오도록 함
        targetRotation =
          baseRotation +
          (360 - (winningIndex * itemAngle + sectionMiddleOffset));
      } else {
        // 현재 화살표 위치(prevWinningIndex)에서 새로운 당첨 위치(winningIndex)로 가는 각도 계산

        // 이전 당첨 위치에서 새로운 당첨 위치까지의 각도 계산
        // 이때 items.length - prevWinningIndex.current는 이전 위치에서 시계 반대 방향으로의 오프셋
        const targetPosition =
          winningIndex * itemAngle +
          (items.length - prevWinningIndex.current) * itemAngle;

        // 기본 회전(여러 번 회전하기 위한 값) + 목표 위치까지의 각도
        // 360도에서 목표 위치를 빼서 시계 방향으로 회전하도록 함
        targetRotation = baseRotation + (360 - targetPosition);
      }

      setRotation((prev) => prev + targetRotation);

      setTimeout(() => {
        setIsSpinning(false);
        count.current++;
        prevWinningIndex.current = winningIndex;
        onSpinEnd?.(items[winningIndex] as number);
      }, spinSpeed * 1000);
    } catch (error) {
      console.error('Failed to get winning index:', error);
      setIsSpinning(false);
    }
  }, [items, isSpinning, disabled, onSpinStart, onSpinEnd]);

  // 마커 애니메이션 효과 구현
  useEffect(() => {
    let startTime: number;
    let frameId: number;

    const rotationKeyframes = [
      0, -85, -30, -75, -30, -65, -25, -55, -15, -45, 0, -20, 0,
    ];
    const keyframeDuration = (spinSpeed * 1000) / rotationKeyframes.length;

    const animateMarker = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (isSpinning) {
        const cycleTime = elapsed % (spinSpeed * 1000);
        const keyframeIndex = Math.min(
          Math.floor(cycleTime / keyframeDuration),
          rotationKeyframes.length - 1,
        );
        const nextKeyframeIndex = Math.min(
          (keyframeIndex + 1) % rotationKeyframes.length,
          rotationKeyframes.length - 1,
        );

        const progress = (cycleTime % keyframeDuration) / keyframeDuration;
        const currentRotation = rotationKeyframes[keyframeIndex] || 0;
        const nextRotation = rotationKeyframes[nextKeyframeIndex] || 0;

        // 두 키프레임 사이의 값을 보관
        const interpolatedRotation =
          currentRotation + (nextRotation - currentRotation) * progress;
        setMarkerRotation(interpolatedRotation);

        frameId = requestAnimationFrame(animateMarker);
      } else {
        setMarkerRotation(0);
      }
    };

    if (isSpinning) {
      frameId = requestAnimationFrame(animateMarker);
    } else {
      setMarkerRotation(0);
    }

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isSpinning, spinSpeed]);

  return (
    <div className="roulette-wrapper" style={{ width, height }}>
      {/* 룰렛 본체 */}
      <div className="roulette-body">
        <div
          className="roulette-wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          }}
        >
          {/* 룰렛 섹션들 */}
          {items?.map((item, index) => {
            const angle = 360 / items.length;
            const rotate = angle * index - 90;

            // 섹션의 시작과 끝 각도 계산
            const startAngle = rotate * (Math.PI / 180);
            const endAngle = (rotate + angle) * (Math.PI / 180);
            const startX = 50 + 50 * Math.cos(startAngle);
            const startY = 50 + 50 * Math.sin(startAngle);
            const endX = 50 + 50 * Math.cos(endAngle);
            const endY = 50 + 50 * Math.sin(endAngle);

            return (
              <div key={index} className="roulette-section">
                {/* 섹션 배경 */}
                <div
                  className="roulette-section-bg"
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? sectionColors[1] : sectionColors[0],
                    clipPath: `polygon(50% 50%, ${startX}% ${startY}%, ${endX}% ${endY}%)`,
                  }}
                />
              </div>
            );
          })}

          {/* 구분선들 */}
          {items?.map((_, index) => {
            const angle = 360 / items.length;
            const rotate = angle * index - 90;
            return (
              <div
                key={`line-${index}`}
                className="roulette-divider"
                style={{
                  width: '46%',
                  height: '1px',
                  transform: `rotate(${rotate}deg)`,
                  left: '50%',
                  top: '50%',
                  transformOrigin: '0 50%',
                  backgroundColor: 'black',
                }}
              />
            );
          })}

          {/* 라벨들 */}
          {items?.map((item, index) => {
            const angle = 360 / items.length;
            const rotate = angle * index - 90;
            const textRotate = rotate + angle / 2;
            const radian = ((rotate + angle / 2) * Math.PI) / 180;
            const labelRadius = 32;
            const x = 50 + labelRadius * Math.cos(radian);
            const y = 50 + labelRadius * Math.sin(radian);

            return (
              <div
                key={`label-${index}`}
                className="roulette-label"
                style={{
                  transform: `translate(-50%, -50%) rotate(${textRotate}deg)`,
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                <div
                  className="roulette-label-content"
                  style={{
                    transform: `rotate(90deg)`,
                    transformOrigin: 'center',
                  }}
                >
                  <span
                    className="roulette-label-text"
                    style={{ color: textColor }}
                  >
                    <b>{item}</b>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 중앙 원형 영역 */}
        <div
          className="roulette-center"
          style={{
            backgroundColor: sectionColors[1],
            border: '2px solid black',
          }}
        >
          <div className="roulette-center-inner">
            {/* 중앙 버튼 */}
            <button
              onClick={spin}
              disabled={disabled}
              className="roulette-button"
              style={{
                borderColor: buttonBorderColor,
                backgroundColor: isSpinning
                  ? buttonDisabledBgColor
                  : buttonBgColor,
                cursor: isSpinning || disabled ? 'not-allowed' : 'pointer',
              }}
              onMouseOver={(e) => {
                if (!isSpinning && !disabled) {
                  e.currentTarget.style.borderColor = buttonHoverBorderColor;
                  e.currentTarget.style.backgroundColor = buttonHoverBgColor;
                }
              }}
              onFocus={(e) => {
                if (!isSpinning && !disabled) {
                  e.currentTarget.style.borderColor = buttonHoverBorderColor;
                  e.currentTarget.style.backgroundColor = buttonHoverBgColor;
                }
              }}
              onMouseOut={(e) => {
                if (!isSpinning && !disabled) {
                  e.currentTarget.style.borderColor = buttonBorderColor;
                  e.currentTarget.style.backgroundColor = buttonBgColor;
                }
              }}
              onBlur={(e) => {
                if (!isSpinning && !disabled) {
                  e.currentTarget.style.borderColor = buttonBorderColor;
                  e.currentTarget.style.backgroundColor = buttonBgColor;
                }
              }}
            >
              {disabled ? (
                <span className="roulette-button-text">
                  <strong>{Math.ceil(remainSecond / 3600)}</strong>
                </span>
              ) : (
                <span className="roulette-button-text">Start</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 외부 테두리 */}
      <div className="roulette-outer-border">
        <div className="roulette-border">
          <div
            className="roulette-border-thick"
            style={{ borderColor: outerBorderColor }}
          />
        </div>

        {/* 노란 점들 */}
        <div
          className="roulette-dots"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)',
          }}
        >
          {items?.map((_, index) => {
            const angle = 360 / items.length;
            const rotate = angle * index - 90;
            const radian = (rotate * Math.PI) / 180;
            const radius = 46;
            const x = 50 + radius * Math.cos(radian);
            const y = 50 + radius * Math.sin(radian);

            return (
              <div
                key={`dot-${index}`}
                className="roulette-dot"
                style={{
                  backgroundColor: dotColor,
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: dotBorderColor,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* 빨간 화살표 마커 */}
      <div className="roulette-marker-container">
        <div className="roulette-marker-wrapper">
          <div
            ref={markerRef}
            className="roulette-marker"
            style={{
              transform: `rotate(${markerRotation}deg)`,
              transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
              animation: isSpinning
                ? `markerShake ${spinSpeed}s ease-in-out infinite alternate`
                : 'none',
            }}
          >
            <div className="roulette-marker-svg-container">
              <svg
                width="60"
                height="100"
                viewBox="0 0 60 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="roulette-marker-svg"
              >
                <title>Roulette Marker</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M50.6896 51.7243C56.4254 46.26 60 38.5474 60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 38.5474 3.57459 46.26 9.3104 51.7243L30 100L50.6896 51.7243Z"
                  fill={markerColor}
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M49.013 50.5592L49.3101 50.2762C54.6661 45.1737 58 37.9778 58 30C58 14.536 45.464 2 30 2C14.536 2 2 14.536 2 30C2 37.9778 5.33387 45.1737 10.6899 50.2762L10.987 50.5592L30 94.9228L49.013 50.5592ZM30 100L9.3104 51.7243C3.57459 46.26 0 38.5474 0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 38.5474 56.4254 46.26 50.6896 51.7243L30 100Z"
                  fill="black"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="6"
                  fill={dotColor}
                  stroke={dotBorderColor}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes markerShake {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(-85deg); }
          20% { transform: rotate(-30deg); }
          30% { transform: rotate(-75deg); }
          40% { transform: rotate(-30deg); }
          50% { transform: rotate(-65deg); }
          60% { transform: rotate(-25deg); }
          70% { transform: rotate(-55deg); }
          80% { transform: rotate(-15deg); }
          90% { transform: rotate(-20deg); }
          100% { transform: rotate(0deg); }
        }
      `,
        }}
      />
    </div>
  );
}
