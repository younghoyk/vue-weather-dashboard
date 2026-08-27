export const weatherData = [
  {
    id: 'city_01',
    name: '서울',
    region: '대한민국 서울특별시',
    lat: 37.5665,
    lon: 126.978,
  },
  {
    id: 'city_02',
    name: '수원',
    region: '대한민국 경기도 수원시',
    lat: 37.2636,
    lon: 127.0286,
  },
  {
    id: 'city_03',
    name: '부산',
    region: '대한민국 부산광역시',
    lat: 35.1796,
    lon: 129.0756,
  },
  {
    id: 'city_04',
    name: '제주',
    region: '대한민국 제주특별자치도',
    lat: 33.4996,
    lon: 126.5312,
  },
  {
    id: 'city_05',
    name: '대구',
    region: '대한민국 대구광역시',
    lat: 35.8714,
    lon: 128.6014,
  },
]

export function findCityById(cityId) {
  return weatherData.find((city) => city.id === cityId)
}
