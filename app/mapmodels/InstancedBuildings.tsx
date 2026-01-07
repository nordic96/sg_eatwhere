'use client';

import * as THREE from 'three';
import { InstancedMesh } from 'three';
import { useRef, useLayoutEffect } from 'react';
import { useInstancingModel } from '@/app/hooks/useInstancingModel';

import { EateryCategory, FoodHeritage } from '../types';
import { geoConverter } from '../utils';
import { MODEL_MAP } from '../constants/modelTypes';
import { useHeritageStore } from '../stores';
import { ThreeEvent } from '@react-three/fiber';

export function InstancedBuildings({ locations }: { locations: FoodHeritage[] }) {
  const { filter, setHeritageId } = useHeritageStore();

  // Load each model once
  const restaurantModel = useInstancingModel(MODEL_MAP.restaurant);
  const hawkerModel = useInstancingModel(MODEL_MAP.hawker);
  const dessertModel = useInstancingModel(MODEL_MAP.dessert);

  const restaurantRef = useRef<InstancedMesh>(null);
  const hawkerRef = useRef<InstancedMesh>(null);
  const dessertRef = useRef<InstancedMesh>(null);

  // ⭐ NEW: Map instanceId → real FoodHeritage.id
  const restaurantIdMap = useRef<Record<number, string>>({});
  const hawkerIdMap = useRef<Record<number, string>>({});
  const dessertIdMap = useRef<Record<number, string>>({});

  // Build instanced meshes
  useLayoutEffect(() => {
    if (!restaurantRef.current || !hawkerRef.current || !dessertRef.current) return;

    const temp = new THREE.Matrix4();

    let r = 0;
    let h = 0;
    let d = 0;

    restaurantIdMap.current = {};
    hawkerIdMap.current = {};
    dessertIdMap.current = {};

    locations.forEach((loc) => {
      const { latitude, longitude } = loc.location.geoLocation;
      const position = geoConverter({ latitude, longitude });

      temp.compose(
        new THREE.Vector3(...position),
        new THREE.Quaternion(),
        new THREE.Vector3(0.5, 0.5, 0.5),
      );

      switch (loc.category) {
        case 'restaurant':
          restaurantRef.current?.setMatrixAt(r, temp);
          restaurantIdMap.current[r++] = loc.id; // ⭐ MAP instanceId → heritage ID
          break;

        case 'hawker':
          hawkerRef.current?.setMatrixAt(h, temp);
          hawkerIdMap.current[h++] = loc.id; // ⭐
          break;

        case 'dessert':
          dessertRef.current?.setMatrixAt(d, temp);
          dessertIdMap.current[d++] = loc.id; // ⭐
          break;
      }
    });

    restaurantRef.current.instanceMatrix.needsUpdate = true;
    hawkerRef.current.instanceMatrix.needsUpdate = true;
    dessertRef.current.instanceMatrix.needsUpdate = true;
  }, [locations]);

  // Filter visibility
  useLayoutEffect(() => {
    if (restaurantRef.current) restaurantRef.current.visible = filter.includes('restaurant');
    if (hawkerRef.current) hawkerRef.current.visible = filter.includes('hawker');
    if (dessertRef.current) dessertRef.current.visible = filter.includes('dessert');
  }, [filter]);

  // Count per-category
  const countRestaurant = locations.filter((l) => l.category === 'restaurant').length;
  const countHawker = locations.filter((l) => l.category === 'hawker').length;
  const countDessert = locations.filter((l) => l.category === 'dessert').length;

  // Pointer handlers
  const handlePointerMove = () => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.instanceId != null) {
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  const handleClick = (type: EateryCategory) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.instanceId == null) return;

    let heritageId: string | undefined;

    if (type === 'restaurant') heritageId = restaurantIdMap.current[e.instanceId];
    if (type === 'hawker') heritageId = hawkerIdMap.current[e.instanceId];
    if (type === 'dessert') heritageId = dessertIdMap.current[e.instanceId];

    if (heritageId) {
      setHeritageId(heritageId); // ✔ now directly uses real heritage ID
    }
  };

  return (
    <>
      {/* Restaurants */}
      <instancedMesh
        ref={restaurantRef}
        args={[restaurantModel.geometry, restaurantModel.material, countRestaurant]}
        onPointerMove={handlePointerMove()}
        onPointerOut={handlePointerOut}
        onClick={handleClick('restaurant')}
      />

      {/* Hawker Stalls */}
      <instancedMesh
        ref={hawkerRef}
        args={[hawkerModel.geometry, hawkerModel.material, countHawker]}
        onPointerMove={handlePointerMove()}
        onPointerOut={handlePointerOut}
        onClick={handleClick('hawker')}
      />

      {/* Dessert Stalls */}
      <instancedMesh
        ref={dessertRef}
        args={[dessertModel.geometry, dessertModel.material, countDessert]}
        onPointerMove={handlePointerMove()}
        onPointerOut={handlePointerOut}
        onClick={handleClick('dessert')}
      />
    </>
  );
}
