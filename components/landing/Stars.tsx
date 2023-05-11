import { PointMaterial, Points } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { random } from "maath";
import { useRef, useState } from "react";

function Stars(props: any) {
  const { gl } = useThree();

  const ref = useRef<any>();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.5 })
  );
  useFrame((state, delta) => {
    ref.current!.rotation.x -= delta / 5;
    ref.current!.rotation.y -= delta / 8;
  });

  const [color, setColor] = useState("#E5E7EB");

  gl.domElement.addEventListener("mouseover", () => setColor("#f38020")); // change to red on hover
  gl.domElement.addEventListener("mouseout", () => setColor("#E5E7EB")); // reset color when not hovering

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color={color}
          size={0.007}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function WordStar() {
  return (
    <Canvas camera={{ position: [0, 0, 0.5] }}>
      <Stars />
    </Canvas>
  );
}
