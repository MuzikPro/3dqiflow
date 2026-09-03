import { MutableRefObject, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { QiMotion } from '../AxisWheel/qiMotion';
import { phasePosition, phaseTerm, heightFactor, sunColor, sunRadius, sunGlow, SUN_STOPS, RING_RADIUS, RING_CENTER_Y } from './sunPath';

const YEAR_SECONDS = 20; // 规格书：自动播放一年 20 秒

interface Props {
  phaseRef: MutableRefObject<number>;
  playing: boolean;
  slowmo: boolean;
  compare: boolean;
  /** 当前节气变化时通知 UI（低频 setState） */
  onTermChange: (index: number) => void;
  /** 人体联动：驱动右侧小人体的气机仪表盘 */
  humanMotion: QiMotion;
}

/** 太阳热球体 + 跟随光源 + 对比模式的冬至/夏至参照球 */
export function SunSystem({ phaseRef, playing, slowmo, compare, onTermChange, humanMotion }: Props) {
  const sunRef = useRef<THREE.Mesh>(null);
  const sunMatRef = useRef<THREE.MeshPhongMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const lastTerm = useRef(-1);
  const scratchPos = useMemo(() => new THREE.Vector3(), []);
  const scratchColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    if (playing) {
      phaseRef.current = (phaseRef.current + (Math.min(delta, 0.1) / YEAR_SECONDS) * (slowmo ? 0.2 : 1)) % 1;
    }
    const t = phaseRef.current;
    phasePosition(t, scratchPos);
    const h = heightFactor(scratchPos.y);

    if (sunRef.current) {
      sunRef.current.position.copy(scratchPos);
      sunRef.current.scale.setScalar(sunRadius(h));
    }
    if (sunMatRef.current) {
      sunColor(h, scratchColor);
      sunMatRef.current.color.copy(scratchColor);
      sunMatRef.current.emissive.copy(scratchColor);
      sunMatRef.current.emissiveIntensity = sunGlow(h);
    }
    if (lightRef.current) {
      lightRef.current.position.copy(scratchPos);
      lightRef.current.color.copy(scratchColor);
      lightRef.current.intensity = 0.4 + h * 1.0;
    }

    // 人体联动（规格书表）：左半圈升→左轨加速；右半圈降→右轨加速；轴随高度明暗快慢
    const ascending = t < 0.5;
    humanMotion.leftFlow.v = ascending ? 1.6 : 0.45;
    humanMotion.rightFlow.v = ascending ? 0.45 : 1.6;
    humanMotion.axleSpeed.v = 0.25 + h * 1.2;
    humanMotion.axleGlow.v = 0.25 + h * 0.9;
    humanMotion.loopGlow.v = 0.15 + h * 0.2;

    const term = phaseTerm(t);
    if (term !== lastTerm.current) {
      lastTerm.current = term;
      onTermChange(term);
    }
  });

  return (
    <group>
      <mesh ref={sunRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial ref={sunMatRef} color={SUN_STOPS.mid.color} emissive={SUN_STOPS.mid.color} emissiveIntensity={0.5} />
      </mesh>
      <pointLight ref={lightRef} distance={18} decay={0} intensity={0.8} />
      {/* 对比模式：冬至/夏至两球并现，直观对比大小·颜色·高度 */}
      {compare && (
        <group>
          <mesh position={[0, RING_CENTER_Y - RING_RADIUS, 0]} scale={SUN_STOPS.winter.radius}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshPhongMaterial
              color={SUN_STOPS.winter.color}
              emissive={SUN_STOPS.winter.color}
              emissiveIntensity={SUN_STOPS.winter.glow}
              transparent
              opacity={0.55}
            />
          </mesh>
          <mesh position={[0, RING_CENTER_Y + RING_RADIUS, 0]} scale={SUN_STOPS.summer.radius}>
            <sphereGeometry args={[1, 24, 24]} />
            <meshPhongMaterial
              color={SUN_STOPS.summer.color}
              emissive={SUN_STOPS.summer.color}
              emissiveIntensity={SUN_STOPS.summer.glow}
              transparent
              opacity={0.55}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
