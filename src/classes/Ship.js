import * as THREE from 'three'

import { TILE_GEOMETRY, MATERIALS, COLORS } from '../constants/3DBOARD';
const { TILE_HEIGHT, TILE_BASE } = TILE_GEOMETRY;


class Ship {
  constructor(shipData) {
    const {typeStr, segments, angle, position, id} = shipData;

    this._type = typeStr;
    const [segmentArr, segmentGroup] = this.makeSegments(this._type, segments);
    this._segmentArr = segmentArr;
    this._segmentGroup = segmentGroup;
    this._angle = angle;
    this._position = position;
    this._id = id;
  }

  get mesh() {
    return this._segmentGroup;
  }

  makeSegments(type, segments) {
    // Create each segment mesh and add it to the array of segments
    const segmentArr = segments.map((segment, index) => {
      const mesh = this.makeSegmentMesh(type, index);
      mesh.position.y = index * (2 * TILE_HEIGHT);
      return {
        ...segment,
        mesh
      }
    })

    // Create the group that holds all the segments for positioning
    const segmentGroup = new THREE.Group();
    segmentArr.forEach(segment => segmentGroup.add(segment.mesh))

    return [segmentArr, segmentGroup]
  }

  makeSegmentMesh(type, index) {
    const segmentLength = TILE_HEIGHT * 2;
    const segmentGeom = new THREE.BoxGeometry( 1, segmentLength, 1)
    const material = new THREE.MeshBasicMaterial( {color: 0x666666} );

    return new THREE.Mesh(segmentGeom, material);
  }
}

export default Ship;