'use client';

import * as THREE from 'three';
import { InstancedMesh } from 'three';
import { useRef, useLayoutEffect } from 'react';
import { useInstancingModel } from '@/app/hooks/useInstancingModel';

import { FoodHeritage } from '../types';
import { geoConverter } from '../utils';
import { MODEL_MAP } from '../constants/modelTypes';
import { useHeritageStore } from '../stores';

export function InstancedBuildings({ locations }: { locations: FoodHeritage[] }) {
  const { filter } = useHeritageStore();
  // Load each model only once
  const restaurantModel = useInstancingModel(MODEL_MAP.restaurant);
  const hawkerModel = useInstancingModel(MODEL_MAP.hawker);
  const dessertModel = useInstancingModel(MODEL_MAP.dessert);

  const restaurantRef = useRef<InstancedMesh>(null);
  const hawkerRef = useRef<InstancedMesh>(null);
  const dessertRef = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    if (
      restaurantRef.current === null ||
      hawkerRef.current === null ||
      dessertRef.current === null
    ) {
      return;
    }
    const temp = new THREE.Matrix4();

    let countRestaurant = 0;
    let countHawker = 0;
    let countDessert = 0;

    locations.forEach((loc) => {
      const { latitude, longitude } = loc.location.geoLocation;
      const position = geoConverter({ latitude, longitude });
      //Building Height Y value
      position[1] += 1.5;

      temp.compose(
        new THREE.Vector3(...position),
        new THREE.Quaternion(), // no rotation needed unless you want it
        new THREE.Vector3(1.5, 1.5, 1.5), // scale for all models, customize if needed
      );

      switch (loc.category) {
        case 'restaurant':
          restaurantRef?.current?.setMatrixAt(countRestaurant++, temp);
          break;
        case 'hawker':
          hawkerRef?.current?.setMatrixAt(countHawker++, temp);
          break;
        case 'dessert':
          dessertRef?.current?.setMatrixAt(countDessert++, temp);
          break;
      }
    });

    restaurantRef.current.instanceMatrix.needsUpdate = true;
    hawkerRef.current.instanceMatrix.needsUpdate = true;
    dessertRef.current.instanceMatrix.needsUpdate = true;
  }, [locations]);

  useLayoutEffect(() => {
    if (restaurantRef.current) {
      restaurantRef.current.visible = filter.includes('restaurant');
    }
    if (hawkerRef.current) {
      hawkerRef.current.visible = filter.includes('hawker');
    }
    if (dessertRef.current) {
      dessertRef.current.visible = filter.includes('dessert');
    }
  }, [filter]);

  // Pre-filter counts for each InstancedMesh
  const countRestaurant = locations.filter((l) => l.category === 'restaurant').length;
  const countHawker = locations.filter((l) => l.category === 'hawker').length;
  const countDessert = locations.filter((l) => l.category === 'dessert').length;

  return (
    <>
      {/* Restaurants */}
      <instancedMesh
        ref={restaurantRef}
        args={[restaurantModel.geometry, restaurantModel.material, countRestaurant]}
      />

      {/* Hawker Stalls */}
      <instancedMesh
        ref={hawkerRef}
        args={[hawkerModel.geometry, hawkerModel.material, countHawker]}
      />

      {/* Dessert Stalls */}
      <instancedMesh
        ref={dessertRef}
        args={[dessertModel.geometry, dessertModel.material, countDessert]}
      />
    </>
  );
}
