'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  type ComponentType,
  type FormEvent,
  type ReactNode,
  useEffect,
  useState,
} from 'react';

import {
  ArrowRight,
  Bike,
  BookOpen,
  Camera,
  ChevronDown,
  Clock3,
  Crosshair,
  Heart,
  Map,
  MapPin,
  Menu,
  Paintbrush,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  Users,
  Wrench,
} from 'lucide-react';

import LabelMotoLogo from '@/components/app/logo';
import UserMenu from '@/components/app/user-menu';

type Side =
  | 'left'
  | 'right'
  | 'center';

type QuickChoice = {
  label: string;
  value: string;
  filter?: string;
  icon: ComponentType<{
    className?: string;
  }>;
};

type ProChoice = {
  label: string;
  href: string;
  icon: ComponentType<{
    className?: string;
  }>;
};

const QUICK_CHOICES: QuickChoice[] = [
  {
    label: 'Concessions',
    value: 'Concession moto',
    filter: 'shopping',
    icon: Store,
  },
  {
    label: 'Garages',
    value: 'Garage moto',
    filter: 'service',
    icon: Wrench,
  },
  {
    label: 'Associations',
    value: 'Association moto',
    filter: 'association',
    icon: Users,
  },
  {
    label: 'Relais motards',
    value: 'Relais motards',
    filter: 'relais',
    icon: MapPin,
  },
];

const PRO_CHOICES: ProChoice[] = [
  {
    label: 'Garages & ateliers',
    href: '/map?filter=service',
    icon: Wrench,
  },
  {
    label: 'Concessions',
    href: '/map?filter=shopping',
    icon: Store,
  },
  {
    label: 'Transporteurs moto',
    href: '/map?search=transporteur%20moto',
    icon: Truck,
  },
  {
    label: 'Préparateurs',
    href: '/map?search=préparateur%20moto',
    icon: Settings,
  },
  {
    label: 'Peintres',
    href: '/map?search=peintre%20moto',
    icon: Paintbrush,
  },
  {
    label: 'Photographes',
    href: '/map?search=photographe%20moto',
    icon: Camera,
  },
  {
    label: 'Équipementiers',
    href: '/map?search=équipement%20moto',
    icon: ShoppingBag,
  },
  {
    label: 'Associations',
    href: '/map?filter=association',
    icon: Users,
  },
];

const TECH_SHEETS = [
  {
    brand: 'CFMOTO',
    model: '450MT',
    href: '/fiches/cfmoto-450mt-2024-plus',
    image: '/images/entretien-cfmoto-450mt.webp',
  },
  {
    brand: 'Honda',
    model: 'XL750 Transalp',
    href: '/fiches/honda-xl750-transalp-2023-plus',
    image: '/images/honda-xl750-transalp-2023-plus.webp',
  },
  {
    brand: 'Yamaha',
    model: 'MT-07',
    href: '/fiches/yamaha-mt-07-2021-plus',
    image: '/images/yamaha-mt07-2021-plus.webp',
  },
  {
    brand: 'VOGE',
    model: 'DS900X',
    href: '/fiches/voge-ds900x-2025-plus',
    image: null,
  },
  {
    brand: 'QJ Motor',
    model: 'SRK 800 RR',
    href: '/fiches/qjmotor-srk800rr-2024-plus',
    image: '/images/qjmotor-srk800rr-2024-plus.webp',
  },
  {
    brand: 'CFMOTO',
    model: '800MT',
    href: '/fiches/cfmoto-800mt-sport-explore-2023-plus',
    image: '/images/entretien-cfmoto-800mt.webp',
  },
  {
    brand: 'KOVE',
    model: '800X Pro',
    href: '/fiches/kove-800x-pro-2024-plus',
    image: null,
  },
];

function normalizeSearch(
  value: string
) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .trim();
}

function inferFilter(
  value: string
) {
  const normalized =
    normalizeSearch(value);

  if (
    normalized.includes('garage') ||
    normalized.includes('atelier') ||
    normalized.includes('mecan')
  ) {
    return 'service';
  }

  if (
    normalized.includes('concession')
  ) {
    return 'shopping';
  }

  if (
    normalized.includes('association')
  ) {
    return 'association';
  }

  if (
    normalized.includes('relais')
  ) {
    return 'relais';
  }

  return '';
}

/*
 * ============================================================
 * GRAND ITINERAIRE DECORATIF
 * ============================================================
 *
 * Aucun texte dans le SVG.
 * Aucune image.
 *
 * Il peut donc s'étirer avec la page sans jamais déformer
 * du contenu.
 *
 * Les courbes sont volontairement très larges et simples.
 */

function RouteBackdrop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 430 2800"
      preserveAspectRatio="none"
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        h-full
        w-full
      "
    >
      {/* quelques lignes de fond extrêmement légères */}

      <g
        fill="none"
        stroke="#edf1f3"
        strokeWidth="1"
        strokeOpacity="0.8"
      >
        <path
          d="
            M36 330
            C120 290 190 320 278 280
            C335 255 372 270 414 240
          "
        />

        <path
          d="
            M24 805
            C110 760 178 800 258 760
            C320 730 365 750 421 710
          "
        />

        <path
          d="
            M17 1320
            C107 1275 195 1315 272 1274
            C327 1244 370 1260 423 1218
          "
        />

        <path
          d="
            M19 1845
            C109 1808 190 1840 270 1804
            C327 1778 368 1795 420 1759
          "
        />

        <path
          d="
            M20 2335
            C110 2295 196 2330 277 2290
            C330 2264 375 2280 420 2244
          "
        />
      </g>

      {/* route orange unique à largeur variable */}
      <path
        d="
          M103 99.6
          L107.9 103.9
          L113.8 108.1
          L120.3 111.9
          L127.6 115.4
          L135.5 118.4
          L144 120.9
          L153.2 123.1
          L163 124.8
          L173.6 126
          L195.8 127
          L207.6 126.7
          L219.5 126.2
          L231.5 125.4
          L243.6 124.5
          L255.8 123.6
          L268 122.9
          L280 122.4
          L291.9 122.2
          L303.5 122.5
          L324.3 124.2
          L333.3 126
          L341.9 128.6
          L350 132.3
          L357.5 137
          L364.3 142.8
          L370.3 149.7
          L375.5 157.9
          L379.7 167.3
          L384.2 185.9
          L385.3 193.9
          L386.4 202.3
          L387.3 211.2
          L388.2 220.5
          L388.9 230.1
          L389.6 240.2
          L390.2 250.6
          L390.6 261.4
          L391 272.5
          L391.3 284
          L391.5 295.8
          L391.6 308
          L391.6 320.5
          L391.5 333.3
          L391.4 346.4
          L391.1 359.8
          L390.8 373.5
          L390.4 387.4
          L389.9 401.7
          L389.3 416.2
          L388.6 430.9
          L384.6 457.1
          L380.6 467.4
          L375.8 477
          L370.2 486
          L364 494.3
          L357.1 501.9
          L349.6 509
          L341.7 515.4
          L333.2 521.4
          L324.2 526.8
          L314.9 531.9
          L305.2 536.4
          L295.2 540.7
          L284.9 544.5
          L274.4 548.1
          L263.8 551.4
          L253 554.4
          L242.2 557.2
          L231.4 559.9
          L220.5 562.5
          L198.3 567.6
          L187.2 570.7
          L176.5 574.3
          L166.2 578.3
          L156.3 582.8
          L146.9 587.7
          L137.9 593.1
          L129.5 599
          L121.5 605.4
          L114.1 612.2
          L107.2 619.5
          L100.9 627.3
          L95.1 635.6
          L90 644.4
          L85.6 653.7
          L81.8 663.5
          L78.7 673.8
          L76.2 684.7
          L74.5 696
          L73.6 707.8
          L73.3 720.2
          L75.1 743.2
          L77 753
          L79.6 762.3
          L82.9 771.1
          L86.9 779.6
          L91.6 787.6
          L96.9 795.3
          L102.8 802.6
          L109.4 809.5
          L116.5 816
          L124.2 822.2
          L132.4 828
          L141.2 833.5
          L150.5 838.7
          L160.2 843.6
          L170.5 848.2
          L181.1 852.5
          L192.3 856.6
          L203.8 860.3
          L215.7 863.9
          L228.1 867.2
          L240.7 870.2
          L267.6 876.3
          L280.5 879.9
          L292.7 883.9
          L304.1 888.3
          L314.8 893
          L324.6 898.2
          L333.7 903.8
          L342 909.7
          L349.5 916
          L356.3 922.7
          L362.4 929.7
          L367.7 937.1
          L372.2 944.9
          L376 953.1
          L379.1 961.6
          L381.5 970.5
          L383.1 979.7
          L384 989.3
          L384.2 999.3
          L383.7 1009.6
          L382.5 1020.3
          L380.6 1031.3
          L374.9 1053.7
          L371.2 1064.1
          L366.9 1073.8
          L362 1082.9
          L356.5 1091.5
          L350.5 1099.5
          L343.9 1106.9
          L336.9 1113.9
          L329.4 1120.4
          L321.4 1126.4
          L312.9 1131.9
          L304.1 1137
          L294.9 1141.7
          L285.3 1146.1
          L275.3 1150
          L265 1153.6
          L254.4 1156.8
          L243.6 1159.8
          L232.5 1162.4
          L221.1 1164.8
          L209.6 1166.9
          L197.8 1168.8
          L185.9 1170.4
          L161.8 1173.8
          L150.5 1176.3
          L140 1179.6
          L130.2 1183.5
          L121.3 1188
          L113 1193.2
          L105.6 1199
          L98.8 1205.3
          L92.8 1212.1
          L87.5 1219.5
          L82.9 1227.4
          L79 1235.7
          L75.8 1244.5
          L73.3 1253.6
          L71.4 1263.2
          L70.2 1273.2
          L69.6 1283.5
          L69.7 1294.1
          L70.3 1305
          L71.6 1316.1
          L73.5 1327.6
          L78.8 1349.5
          L82.4 1359.3
          L86.6 1368.5
          L91.5 1377.2
          L97.1 1385.4
          L103.2 1393
          L109.8 1400.2
          L117.1 1407
          L124.8 1413.3
          L133 1419.2
          L141.6 1424.6
          L150.7 1429.7
          L160.2 1434.4
          L170.1 1438.8
          L180.3 1442.8
          L190.9 1446.6
          L201.7 1450
          L212.8 1453.1
          L224.2 1456
          L235.8 1458.6
          L247.6 1461
          L259.5 1463.2
          L271.6 1465.3
          L296.2 1469.3
          L307.7 1472.1
          L318.5 1475.4
          L328.4 1479.3
          L337.6 1483.8
          L346 1488.8
          L353.6 1494.2
          L360.4 1500.2
          L366.5 1506.6
          L371.8 1513.6
          L376.4 1520.9
          L380.3 1528.7
          L383.4 1536.9
          L385.7 1545.5
          L387.4 1554.6
          L388.3 1564
          L388.5 1573.8
          L388 1583.9
          L386.8 1594.4
          L384.9 1605.2
          L382.3 1616.2
          L375.2 1638.3
          L370.9 1648.2
          L366.1 1657.6
          L360.7 1666.4
          L354.9 1674.6
          L348.6 1682.3
          L341.7 1689.5
          L334.5 1696.2
          L326.7 1702.5
          L318.6 1708.4
          L310 1713.9
          L301 1719
          L291.6 1723.8
          L281.8 1728.4
          L271.6 1732.6
          L261.1 1736.6
          L250.2 1740.4
          L239.1 1743.9
          L227.5 1747.4
          L215.7 1750.6
          L203.6 1753.8
          L191.3 1756.9
          L178.6 1759.9
          L153.5 1766.3
          L142.2 1770.3
          L131.8 1774.8
          L122.4 1780
          L113.8 1785.7
          L106.2 1792
          L99.4 1798.7
          L93.4 1805.9
          L88.2 1813.5
          L83.8 1821.6
          L80.2 1830
          L77.3 1838.7
          L75.2 1847.8
          L73.7 1857.1
          L72.9 1866.7
          L72.8 1876.5
          L73.2 1886.5
          L74.3 1896.6
          L75.9 1906.9
          L78.1 1917.3
          L80.8 1927.8
          L87.6 1948.2
          L92 1957.4
          L97 1966
          L102.7 1974
          L109 1981.5
          L116 1988.4
          L123.4 1994.8
          L131.4 2000.8
          L139.9 2006.3
          L148.8 2011.5
          L158.2 2016.3
          L167.9 2020.8
          L178.1 2025
          L188.5 2028.9
          L199.3 2032.6
          L210.3 2036.2
          L221.6 2039.6
          L233.1 2042.8
          L244.7 2046
          L256.5 2049.2
          L268.5 2052.3
          L280.5 2055.5
          L292.6 2058.7
          L316.9 2065.9
          L328 2070.4
          L338.2 2075.5
          L347.4 2081.2
          L355.6 2087.4
          L363 2094.1
          L369.4 2101.2
          L375 2108.8
          L379.6 2116.8
          L383.5 2125.2
          L386.5 2133.9
          L388.7 2142.9
          L390 2152.3
          L390.6 2161.8
          L390.5 2171.7
          L389.5 2181.7
          L387.8 2191.8
          L385.4 2202.1
          L382.3 2212.6
          L378.5 2223
          L368.8 2243.4
          L363 2252.4
          L356.7 2260.7
          L349.9 2268.5
          L342.7 2275.6
          L335 2282.2
          L326.9 2288.2
          L318.4 2293.8
          L309.5 2299
          L300.3 2303.8
          L290.7 2308.3
          L280.8 2312.5
          L270.7 2316.4
          L260.2 2320.1
          L249.6 2323.7
          L238.7 2327.2
          L227.6 2330.6
          L216.3 2333.9
          L204.9 2337.3
          L193.4 2340.7
          L181.8 2344.3
          L170.1 2348
          L158.4 2351.8
          L135 2360.6
          L124.3 2365.9
          L114.7 2371.9
          L106.2 2378.4
          L98.7 2385.5
          L92.1 2393.1
          L86.5 2401.2
          L81.9 2409.8
          L78.2 2418.7
          L75.4 2428
          L73.5 2437.6
          L72.4 2447.5
          L72.2 2457.7
          L72.8 2468
          L74.2 2478.5
          L76.3 2489.1
          L79.1 2499.9
          L82.7 2510.7
          L91.3 2531
          L96.4 2540
          L102.2 2548.3
          L108.6 2555.9
          L115.6 2562.9
          L123.2 2569.4
          L131.2 2575.4
          L139.8 2580.9
          L148.7 2586
          L158 2590.7
          L167.7 2595.1
          L177.6 2599.3
          L187.9 2603.2
          L198.3 2607
          L208.9 2610.6
          L219.6 2614.1
          L230.5 2617.6
          L241.4 2621.1
          L252.3 2624.6
          L263.1 2628.3
          L273.9 2632
          L294.8 2640.4
          L303.9 2645.3
          L312.2 2650.8
          L319.6 2656.7
          L326.1 2663.2
          L331.7 2670.1
          L336.6 2677.6
          L340.6 2685.5
          L343.8 2694
          L346.3 2702.9
          L348 2712.3
          L348.9 2722.2
          L349.2 2732.6
          L348.7 2743.5
          L347.5 2754.9
          L345.6 2766.7
          L343.1 2779
          L339.9 2791.7
          A1.1 1.1 0 0 1 342.1 2792.3
          L345.3 2779.5
          L347.8 2767.1
          L349.7 2755.2
          L350.9 2743.7
          L351.4 2732.7
          L351.1 2722.1
          L350.2 2712
          L348.4 2702.4
          L345.9 2693.3
          L342.6 2684.6
          L338.5 2676.5
          L333.5 2668.8
          L327.7 2661.7
          L321 2655.1
          L313.5 2649
          L305 2643.5
          L295.6 2638.4
          L274.7 2630
          L263.8 2626.2
          L253 2622.5
          L242 2619
          L231.2 2615.5
          L220.3 2612
          L209.6 2608.5
          L199 2604.9
          L188.6 2601.1
          L178.5 2597.2
          L168.6 2593.1
          L159 2588.7
          L149.7 2584
          L140.9 2579
          L132.5 2573.6
          L124.5 2567.7
          L117.1 2561.3
          L110.2 2554.4
          L104 2546.9
          L98.3 2538.8
          L93.3 2530.1
          L84.8 2509.9
          L81.3 2499.2
          L78.4 2488.6
          L76.3 2478.1
          L75 2467.8
          L74.4 2457.6
          L74.6 2447.7
          L75.7 2437.9
          L77.5 2428.5
          L80.3 2419.4
          L83.9 2410.7
          L88.4 2402.4
          L93.9 2394.5
          L100.2 2387
          L107.6 2380.1
          L116 2373.7
          L125.4 2367.8
          L135.8 2362.6
          L159.1 2353.9
          L170.8 2350.1
          L182.5 2346.4
          L194.1 2342.8
          L205.6 2339.4
          L217 2336
          L228.2 2332.7
          L239.3 2329.3
          L250.2 2325.8
          L261 2322.2
          L271.4 2318.5
          L281.7 2314.5
          L291.6 2310.3
          L301.3 2305.8
          L310.6 2301
          L319.6 2295.7
          L328.2 2290
          L336.4 2283.9
          L344.2 2277.2
          L351.6 2270
          L358.4 2262.1
          L364.8 2253.6
          L370.7 2244.4
          L380.5 2223.9
          L384.4 2213.2
          L387.6 2202.7
          L390 2192.3
          L391.7 2181.9
          L392.7 2171.8
          L392.8 2161.8
          L392.2 2152
          L390.8 2142.5
          L388.6 2133.3
          L385.5 2124.3
          L381.6 2115.8
          L376.8 2107.6
          L371.1 2099.8
          L364.5 2092.5
          L357 2085.7
          L348.6 2079.4
          L339.2 2073.6
          L328.9 2068.4
          L317.6 2063.9
          L293.2 2056.6
          L281.1 2053.4
          L269 2050.2
          L257.1 2047.1
          L245.3 2043.9
          L233.7 2040.7
          L222.2 2037.4
          L211 2034.1
          L200 2030.5
          L189.3 2026.8
          L178.9 2022.9
          L168.8 2018.7
          L159.1 2014.3
          L149.9 2009.6
          L141 2004.5
          L132.7 1999
          L124.8 1993.1
          L117.5 1986.8
          L110.7 1980
          L104.5 1972.7
          L98.9 1964.8
          L93.9 1956.4
          L89.6 1947.4
          L82.9 1927.2
          L80.2 1916.8
          L78.1 1906.5
          L76.5 1896.4
          L75.4 1886.3
          L75 1876.5
          L75.1 1866.8
          L75.9 1857.4
          L77.4 1848.2
          L79.5 1839.3
          L82.3 1830.8
          L85.8 1822.5
          L90.1 1814.7
          L95.1 1807.2
          L101 1800.2
          L107.6 1793.6
          L115.1 1787.5
          L123.5 1781.9
          L132.8 1776.8
          L143 1772.3
          L154.1 1768.4
          L179.1 1762.1
          L191.8 1759
          L204.2 1755.9
          L216.3 1752.8
          L228.1 1749.5
          L239.7 1746.1
          L250.9 1742.5
          L261.9 1738.7
          L272.4 1734.6
          L282.7 1730.4
          L292.5 1725.8
          L302 1721
          L311.1 1715.8
          L319.8 1710.2
          L328.1 1704.2
          L335.9 1697.9
          L343.3 1691
          L350.2 1683.7
          L356.6 1675.9
          L362.6 1667.6
          L368 1658.7
          L372.9 1649.2
          L377.3 1639
          L384.4 1616.9
          L387 1605.6
          L389 1594.7
          L390.2 1584.1
          L390.7 1573.8
          L390.5 1563.8
          L389.6 1554.3
          L387.9 1545.1
          L385.5 1536.2
          L382.3 1527.8
          L378.3 1519.8
          L373.6 1512.3
          L368.2 1505.2
          L362 1498.6
          L355 1492.5
          L347.2 1486.9
          L338.6 1481.9
          L329.3 1477.3
          L319.2 1473.4
          L308.3 1470
          L296.6 1467.1
          L272 1463.1
          L259.9 1461.1
          L248 1458.9
          L236.3 1456.5
          L224.7 1453.9
          L213.4 1451
          L202.4 1447.9
          L191.6 1444.5
          L181.1 1440.8
          L171 1436.8
          L161.2 1432.4
          L151.8 1427.8
          L142.8 1422.7
          L134.2 1417.3
          L126.1 1411.5
          L118.5 1405.3
          L111.4 1398.7
          L104.8 1391.6
          L98.8 1384
          L93.4 1376
          L88.6 1367.5
          L84.4 1358.5
          L80.9 1348.9
          L75.6 1327.2
          L73.8 1315.8
          L72.5 1304.8
          L71.9 1294
          L71.8 1283.5
          L72.4 1273.4
          L73.6 1263.6
          L75.4 1254.1
          L77.9 1245.1
          L81 1236.5
          L84.8 1228.4
          L89.3 1220.7
          L94.5 1213.5
          L100.4 1206.8
          L107 1200.6
          L114.3 1195
          L122.3 1190
          L131.1 1185.5
          L140.7 1181.7
          L151.1 1178.5
          L162.2 1175.9
          L186.2 1172.6
          L198.2 1171
          L209.9 1169.1
          L221.5 1166.9
          L233 1164.6
          L244.1 1161.9
          L255.1 1159
          L265.7 1155.7
          L276.1 1152.1
          L286.1 1148.1
          L295.8 1143.7
          L305.2 1139
          L314.1 1133.8
          L322.6 1128.2
          L330.7 1122.1
          L338.4 1115.5
          L345.5 1108.4
          L352.2 1100.8
          L358.3 1092.7
          L363.9 1084
          L368.8 1074.7
          L373.2 1064.9
          L377 1054.4
          L382.7 1031.8
          L384.7 1020.6
          L385.9 1009.8
          L386.4 999.3
          L386.2 989.2
          L385.3 979.4
          L383.6 970
          L381.2 960.9
          L378.1 952.2
          L374.2 943.9
          L369.5 935.9
          L364.1 928.4
          L357.9 921.2
          L351 914.4
          L343.3 907.9
          L334.9 901.9
          L325.7 896.3
          L315.7 891.1
          L305 886.2
          L293.5 881.8
          L281.2 877.8
          L268.1 874.1
          L241.2 868.1
          L228.6 865
          L216.3 861.8
          L204.5 858.2
          L193 854.5
          L181.9 850.5
          L171.3 846.2
          L161.2 841.6
          L151.5 836.8
          L142.3 831.6
          L133.6 826.2
          L125.5 820.4
          L117.9 814.3
          L110.9 807.9
          L104.5 801.1
          L98.7 794
          L93.4 786.5
          L88.9 778.6
          L84.9 770.3
          L81.7 761.6
          L79.1 752.5
          L77.2 743
          L75.5 720.1
          L75.7 707.9
          L76.7 696.2
          L78.4 685.1
          L80.8 674.4
          L83.9 664.2
          L87.6 654.6
          L92 645.5
          L97 636.8
          L102.6 628.7
          L108.8 621
          L115.6 613.8
          L122.9 607
          L130.8 600.8
          L139.1 595
          L148 589.7
          L157.3 584.8
          L167.1 580.4
          L177.3 576.4
          L187.9 572.8
          L198.9 569.7
          L221 564.6
          L231.9 562.1
          L242.8 559.4
          L253.6 556.5
          L264.4 553.5
          L275.1 550.2
          L285.7 546.6
          L296 542.7
          L306.1 538.5
          L315.9 533.8
          L325.3 528.8
          L334.4 523.2
          L343 517.2
          L351.1 510.6
          L358.7 503.4
          L365.7 495.7
          L372 487.2
          L377.7 478.1
          L382.6 468.3
          L386.8 457.5
          L390.8 431.1
          L391.5 416.3
          L392.1 401.8
          L392.6 387.5
          L393 373.5
          L393.3 359.8
          L393.6 346.4
          L393.7 333.3
          L393.8 320.5
          L393.8 308
          L393.7 295.8
          L393.5 284
          L393.2 272.5
          L392.8 261.3
          L392.4 250.5
          L391.8 240.1
          L391.1 230
          L390.4 220.3
          L389.5 211
          L388.6 202.1
          L387.5 193.6
          L386.3 185.4
          L381.8 166.7
          L377.4 156.9
          L372.1 148.4
          L365.8 141.2
          L358.8 135.2
          L351 130.4
          L342.7 126.6
          L333.9 123.7
          L324.6 121.8
          L303.8 119.3
          L292 118.4
          L280 117.9
          L267.9 117.6
          L255.6 117.5
          L243.4 117.4
          L231.3 117.3
          L219.3 117.2
          L207.6 116.8
          L196.4 116.2
          L174.8 113.8
          L165.2 112
          L156.2 109.9
          L147.9 107.5
          L140.3 104.9
          L133.4 102
          L127.3 98.9
          L121.9 95.7
          L117.2 92.2
          L113 88.4
          A7.5 7.5 0 0 1 103 99.6
          Z
        "
        fill="#e75b00"
      />

    </svg>
  );
}


function MobileRegionLabels() {
  useEffect(() => {
    const layer =
      document.querySelector<HTMLElement>(
        '[data-region-label-layer]'
      );

    if (!layer) return;

    const main =
      layer.closest<HTMLElement>('main');

    if (!main) return;

    let animationFrame:
      number | null = null;

    const normalizeText = (
      value: string | null | undefined
    ) =>
      (value ?? '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLocaleLowerCase('fr');

    const findByText = (
      search: string
    ): HTMLElement | null => {
      const wanted =
        normalizeText(search);

      const elements =
        Array.from(
          main.querySelectorAll<HTMLElement>(
            'h1, h2, h3, h4, p, strong, span, a, button'
          )
        );

      return (
        elements.find(element =>
          normalizeText(
            element.textContent
          ).includes(wanted)
        ) ?? null
      );
    };

    const findCardByText = (
      search: string
    ): HTMLElement | null => {
      const start =
        findByText(search);

      if (!start) return null;

      let current:
        HTMLElement | null = start;

      while (
        current &&
        current !== main
      ) {
        const className =
          typeof current.className ===
          'string'
            ? current.className
            : '';

        const rect =
          current.getBoundingClientRect();

        const looksLikeCard =
          className.includes('rounded') &&
          (
            className.includes('bg-white') ||
            className.includes('bg-muted')
          ) &&
          rect.width > 180 &&
          rect.height > 55;

        if (looksLikeCard) {
          return current;
        }

        current =
          current.parentElement;
      }

      return start;
    };

    const getLabel = (
      key: string
    ) =>
      layer.querySelector<HTMLElement>(
        `[data-region-label="${key}"]`
      );

    const containerRect =
      () =>
        layer.getBoundingClientRect();

    const positionAt = (
      key: string,
      top: number
    ) => {
      const label =
        getLabel(key);

      if (!label) return;

      const maxTop =
        Math.max(
          0,
          layer.offsetHeight -
            label.offsetHeight -
            4
        );

      const safeTop =
        Math.max(
          0,
          Math.min(
            top,
            maxTop
          )
        );

      label.style.top =
        `${safeTop}px`;
    };

    const positionBetween = (
      key: string,
      first: HTMLElement | null,
      second: HTMLElement | null,
      fallback: number
    ) => {
      const label =
        getLabel(key);

      if (!label) return;

      if (!first || !second) {
        positionAt(
          key,
          fallback
        );
        return;
      }

      const rootRect =
        containerRect();

      const firstRect =
        first.getBoundingClientRect();

      const secondRect =
        second.getBoundingClientRect();

      const gapStart =
        firstRect.bottom -
        rootRect.top;

      const gapEnd =
        secondRect.top -
        rootRect.top;

      const middle =
        (
          gapStart +
          gapEnd
        ) / 2;

      positionAt(
        key,
        middle -
          label.offsetHeight / 2
      );
    };

    const intersects = (
      first: DOMRect,
      second: DOMRect,
      padding = 6
    ) =>
      !(
        first.right <
          second.left - padding ||
        first.left >
          second.right + padding ||
        first.bottom <
          second.top - padding ||
        first.top >
          second.bottom + padding
      );

    const getObstacles = () =>
      Array.from(
        main.querySelectorAll<HTMLElement>(
          '[class*="rounded"]'
        )
      ).filter(element => {
        const className =
          typeof element.className ===
          'string'
            ? element.className
            : '';

        const rect =
          element.getBoundingClientRect();

        return (
          (
            className.includes(
              'bg-white'
            ) ||
            className.includes(
              'bg-muted'
            )
          ) &&
          rect.width > 200 &&
          rect.height > 65
        );
      });

    const makeLabelClear = (
      label: HTMLElement,
      obstacles: HTMLElement[]
    ) => {
      const originalTop =
        Number.parseFloat(
          label.style.top || '0'
        );

      const rootRect =
        containerRect();

      const offsets = [
        0,
        -10,
        10,
        -20,
        20,
        -30,
        30,
        -40,
        40,
        -55,
        55,
        -70,
        70,
        -90,
        90,
        -120,
        120,
      ];

      for (
        const offset
        of offsets
      ) {
        const candidateTop =
          Math.max(
            0,
            originalTop + offset
          );

        label.style.top =
          `${candidateTop}px`;

        const labelRect =
          label.getBoundingClientRect();

        const collision =
          obstacles.some(
            obstacle =>
              intersects(
                labelRect,
                obstacle.getBoundingClientRect()
              )
          );

        if (!collision) {
          return;
        }
      }

      label.style.top =
        `${originalTop}px`;
    };

    const layoutRegions = () => {
      const header =
        main.querySelector<HTMLElement>(
          'header'
        );

      const heroTitle =
        findByText(
          'Trouvez un pro moto'
        );

      const searchCard =
        findCardByText(
          'Rechercher'
        );

      const discoveryTitle =
        findByText(
          'Découvrez une nouvelle façon'
        );

      const universe =
        findCardByText(
          'univers moto au même endroit'
        );

      const entretien =
        findCardByText(
          'Entretien moto'
        );

      const trouverPro =
        findCardByText(
          'Trouver le bon pro'
        );

      const technicalSheets =
        findCardByText(
          'fiches techniques moto par modèle'
        );

      const guides =
        findCardByText(
          'Guides & conseils'
        );

      const espacePro =
        findCardByText(
          'Espace pro'
        );

      const reassuranceText =
        findByText(
          'Réseau de confiance'
        );

      const reassurance =
        reassuranceText
          ?.closest<HTMLElement>(
            'section'
          ) ?? null;

      // ==========================================
      // HAUTS-DE-FRANCE
      // Entre le header et le titre principal
      // ==========================================

      positionBetween(
        'hauts',
        header,
        heroTitle,
        108
      );

      // ==========================================
      // ILE-DE-FRANCE
      // Entre la recherche et le titre découverte
      // ==========================================

      positionBetween(
        'ile',
        searchCard,
        discoveryTitle,
        550
      );

      // ==========================================
      // AUTRES LIBELLES
      // Placés entre les vrais encarts
      // ==========================================

      positionBetween(
        'centre',
        universe,
        entretien,
        950
      );

      positionBetween(
        'nouvelle',
        entretien,
        trouverPro,
        1240
      );

      positionBetween(
        'auvergne',
        trouverPro,
        technicalSheets,
        1550
      );

      positionBetween(
        'occitanie',
        technicalSheets,
        guides,
        1940
      );

      // BOUCHES-DU-RHONE :
      // exactement entre Guides et Espace Pro
      positionBetween(
        'bouches',
        guides,
        espacePro,
        2310
      );

      // PACA après Espace Pro
      positionBetween(
        'provence',
        espacePro,
        reassurance,
        2580
      );

      // ==========================================
      // ANTI-COLLISION
      // ==========================================

      const obstacles =
        getObstacles();

      const labels =
        Array.from(
          layer.querySelectorAll<HTMLElement>(
            '[data-region-label]'
          )
        );

      labels.forEach(label => {
        makeLabelClear(
          label,
          obstacles
        );
      });
    };

    const requestLayout = () => {
      if (
        animationFrame !== null
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }

      animationFrame =
        window.requestAnimationFrame(
          layoutRegions
        );
    };

    requestLayout();

    window.addEventListener(
      'resize',
      requestLayout
    );

    const resizeObserver =
      new ResizeObserver(
        requestLayout
      );

    resizeObserver.observe(main);

    return () => {
      window.removeEventListener(
        'resize',
        requestLayout
      );

      resizeObserver.disconnect();

      if (
        animationFrame !== null
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }
    };
  }, []);

  const labelClass = `
    absolute
    z-[2]
    whitespace-nowrap
    text-[9px]
    font-bold
    uppercase
    tracking-[0.14em]
    text-black/[0.07]
  `;

  return (
    <div
      data-region-label-layer
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[2]
        hidden
        overflow-hidden
        max-md:block
      "
    >
      <span
        data-region-label="hauts"
        className={`
          ${labelClass}
          right-[34px]
        `}
      >
        HAUTS-DE-FRANCE
      </span>

      <span
        data-region-label="ile"
        className={`
          ${labelClass}
          left-1/2
          -translate-x-1/2
        `}
      >
        ÎLE-DE-FRANCE
      </span>

      <span
        data-region-label="centre"
        className={`
          ${labelClass}
          right-[16px]
        `}
      >
        CENTRE-VAL DE LOIRE
      </span>

      <span
        data-region-label="nouvelle"
        className={`
          ${labelClass}
          left-[14px]
        `}
      >
        NOUVELLE-AQUITAINE
      </span>

      <span
        data-region-label="auvergne"
        className={`
          ${labelClass}
          right-[12px]
        `}
      >
        AUVERGNE-RHÔNE-ALPES
      </span>

      <span
        data-region-label="occitanie"
        className={`
          ${labelClass}
          left-[18px]
        `}
      >
        OCCITANIE
      </span>

      <span
        data-region-label="bouches"
        className={`
          ${labelClass}
          left-1/2
          -translate-x-1/2
        `}
      >
        BOUCHES-DU-RHÔNE
      </span>

      <span
        data-region-label="provence"
        className={`
          ${labelClass}
          right-[10px]
        `}
      >
        PROVENCE-ALPES-CÔTE D’AZUR
      </span>
    </div>
  );
}
function RoadPin({
  side,
}: {
  side: 'left' | 'right';
}) {
  return (
    <span
      aria-hidden="true"
      className={`
        absolute
        -top-5
        z-20
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-white
        shadow-[0_5px_18px_rgba(0,0,0,0.16)]
        ${
          side === 'left'
            ? '-left-4'
            : '-right-4'
        }
      `}
    >
      <MapPin
        className="
          h-7
          w-7
          fill-brand
          text-brand
        "
      />
    </span>
  );
}

function Stage({
  side,
  pinSide,
  children,
  wide = false,
  height = 'normal',
  desktopHidden = false,
}: {
  side: Side;
  pinSide: 'left' | 'right';
  children: ReactNode;
  wide?: boolean;
  height?:
    | 'compact'
    | 'normal'
    | 'large';
  desktopHidden?: boolean;
}) {
  const align =
    side === 'left'
      ? 'mr-auto ml-5'
      : side === 'right'
        ? 'ml-auto mr-5'
        : 'mx-auto';

  const width =
    wide
      ? 'w-[calc(100%-26px)]'
      : 'w-[76%] max-w-[310px]';

  const size =
    height === 'large'
      ? 'min-h-[390px]'
      : height === 'compact'
        ? 'min-h-[290px]'
        : 'min-h-[340px]';

  return (
    <section
      className={`
        relative
        z-10
        flex
        ${size}
        ${desktopHidden ? 'lg:hidden' : ''}
        w-full
        items-center
        px-1
      `}
    >
      <div
        className={`
          ${align}
          ${width}
          relative
        `}
      >
        <RoadPin
          side={pinSide}
        />

        {children}
      </div>
    </section>
  );
}

function Card({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="
        group
        overflow-hidden
        rounded-[1.65rem]
        border
        border-black/[0.035]
        bg-white/[0.97]
        shadow-[0_18px_48px_rgba(0,0,0,0.085)]
        backdrop-blur-sm
      "
    >
      <summary
        className="
          flex
          min-h-[58px]
          cursor-pointer
          list-none
          items-center
          justify-between
          gap-3
          px-5
          py-4
        "
      >
        <span
          className="
            text-[15px]
            font-black
            leading-tight
            tracking-[-0.025em]
          "
        >
          {title}
        </span>

        <ChevronDown
          className="
            h-4
            w-4
            shrink-0
            text-brand
            transition-transform
            duration-300
            group-open:rotate-180
          "
        />
      </summary>

      <div
        className="
          border-t
          border-border/55
          px-5
          pb-5
          pt-4
        "
      >
        {children}
      </div>
    </details>
  );
}

function HeroSearch() {
  const router =
    useRouter();

  const [
    what,
    setWhat,
  ] = useState('');

  const [
    where,
    setWhere,
  ] = useState('');

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState('');

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    locating,
    setLocating,
  ] = useState(false);

  async function geocode(
    value: string
  ) {
    const response =
      await fetch(
        `https://data.geopf.fr/geocodage/search?q=${encodeURIComponent(value)}&limit=1&autocomplete=0`
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    const feature =
      data?.features?.[0];

    if (
      !feature?.geometry
        ?.coordinates
    ) {
      return null;
    }

    const [
      lng,
      lat,
    ] =
      feature.geometry.coordinates;

    return {
      lat,
      lng,
    };
  }

  async function submitSearch(
    event?: FormEvent
  ) {
    event?.preventDefault();

    setSearching(true);

    try {
      const params =
        new URLSearchParams();

      const filter =
        selectedFilter ||
        inferFilter(what);

      if (filter) {
        params.set(
          'filter',
          filter
        );
      }

      // ===============================================
      // CHAMP "QUE RECHERCHEZ-VOUS ?"
      //
      // La catégorie passe dans ?filter=.
      // On conserve cependant une éventuelle marque.
      // ===============================================

      let whatForSearch =
        what.trim();

      if (filter && whatForSearch) {
        whatForSearch =
          whatForSearch
            .replace(
              /\b(concessions?|concessionnaires?|garages?|ateliers?|associations?|relais|services?)\b/gi,
              ' '
            )
            .replace(
              /\s+/g,
              ' '
            )
            .trim();

        const normalizedResidual =
          normalizeSearch(
            whatForSearch
          );

        if (
          normalizedResidual === 'moto' ||
          normalizedResidual === 'motos' ||
          normalizedResidual === 'motard' ||
          normalizedResidual === 'motards'
        ) {
          whatForSearch = '';
        }
      }

      // ===============================================
      // CHAMP "OU ?"
      // ===============================================

      const rawWhere =
        where.trim();

      const normalizedWhere =
        normalizeSearch(
          rawWhere
        );

      // ===============================================
      // ARRONDISSEMENTS
      //
      // Paris 13
      // Paris 13e
      // Paris 13eme
      // 13e arrondissement Paris
      //
      // Lyon 3
      // Marseille 8
      // ===============================================

      const cityFirstArrondissement =
        normalizedWhere.match(
          /^(paris|lyon|marseille)\s+(\d{1,2})\s*(?:er|e|eme)?(?:\s+arrondissement)?$/
        );

      const numberFirstArrondissement =
        normalizedWhere.match(
          /^(\d{1,2})\s*(?:er|e|eme)?(?:\s+arrondissement)?\s+(?:de\s+)?(paris|lyon|marseille)$/
        );

      let arrondissementCity:
        string | null = null;

      let arrondissementNumber:
        number | null = null;

      if (cityFirstArrondissement) {
        arrondissementCity =
          cityFirstArrondissement[1];

        arrondissementNumber =
          Number(
            cityFirstArrondissement[2]
          );
      }
      else if (numberFirstArrondissement) {
        arrondissementCity =
          numberFirstArrondissement[2];

        arrondissementNumber =
          Number(
            numberFirstArrondissement[1]
          );
      }

      const arrondissementConfig:
        Record<
          string,
          {
            max: number;
            prefix: string;
          }
        > = {
          paris: {
            max: 20,
            prefix: '75',
          },
          lyon: {
            max: 9,
            prefix: '69',
          },
          marseille: {
            max: 16,
            prefix: '13',
          },
        };

      let arrondissementPostalCode:
        string | null = null;

      if (
        arrondissementCity &&
        arrondissementNumber
      ) {
        const config =
          arrondissementConfig[
            arrondissementCity
          ];

        if (
          config &&
          arrondissementNumber >= 1 &&
          arrondissementNumber <= config.max
        ) {
          arrondissementPostalCode =
            `${
              config.prefix
            }${
              String(
                arrondissementNumber
              ).padStart(3, '0')
            }`;
        }
      }

      const isArrondissement =
        Boolean(
          arrondissementPostalCode
        );

      // ===============================================
      // FRANCE = RECHERCHE NATIONALE
      // ===============================================

      const isNationalSearch =
        normalizedWhere === 'france' ||
        normalizedWhere === 'toute la france' ||
        normalizedWhere === 'partout en france';

      const whereForSearch =
        isNationalSearch
          ? ''
          : rawWhere;

      // ===============================================
      // REQUETE CUMULEE
      //
      // Honda + Paris 13
      // => search=Honda Paris 13
      //
      // Garage + Paris 13
      // => filter=service&search=Paris 13
      // ===============================================

      const combinedSearch = [
        whatForSearch,
        whereForSearch,
      ]
        .filter(Boolean)
        .join(' ')
        .trim();

      if (combinedSearch) {
        params.set(
          'search',
          combinedSearch
        );
      }

      // ===============================================
      // DEPARTEMENT SEUL
      //
      // 13 = Bouches-du-Rhône
      // 95 = Val-d'Oise
      // 971 = Guadeloupe
      //
      // Mais Paris 13 n'est PAS un département.
      // ===============================================

      const departmentPattern =
        /^(0[1-9]|[1-8]\d|9[0-5]|2A|2B|97[1-46])$/i;

      const isDepartment =
        !isArrondissement &&
        departmentPattern.test(
          whereForSearch
        );

      // ===============================================
      // GEOCODAGE
      //
      // Pour un arrondissement on envoie le CP exact :
      //
      // Paris 13     -> 75013
      // Lyon 3       -> 69003
      // Marseille 8  -> 13008
      // ===============================================

      if (
        whereForSearch &&
        !isDepartment
      ) {
        const geocodeQuery =
          arrondissementPostalCode ||
          whereForSearch;

        const position =
          await geocode(
            geocodeQuery
          );

        if (position) {
          params.set(
            'lat',
            String(position.lat)
          );

          params.set(
            'lng',
            String(position.lng)
          );

          params.set(
            'zoom',
            isArrondissement
              ? '13'
              : '12'
          );
        }
      }

      router.push(
        `/map${
          params.toString()
            ? `?${params.toString()}`
            : ''
        }`
      );
    }
    finally {
      setSearching(false);
    }
  }
  function usePosition() {
    if (!navigator.geolocation) {
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      position => {
        setLocating(false);

        const params =
          new URLSearchParams({
            lat:
              String(
                position.coords.latitude
              ),
            lng:
              String(
                position.coords.longitude
              ),
            zoom:
              '13',
          });

        const filter =
          selectedFilter ||
          inferFilter(what);

        if (filter) {
          params.set(
            'filter',
            filter
          );
        }
        else if (what.trim()) {
          params.set(
            'search',
            what.trim()
          );
        }

        router.push(
          `/map?${params.toString()}`
        );
      },
      () => {
        setLocating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 300000,
      }
    );
  }

  return (
    <div>
      <form
        onSubmit={submitSearch}
        className="
          rounded-[1.65rem]
          border
          border-black/[0.035]
          bg-white/[0.97]
          p-3
          shadow-[0_18px_48px_rgba(0,0,0,0.09)]
        "
      >
        <label
          className="
            flex
            min-h-[55px]
            items-center
            gap-3
            rounded-[1rem]
            border
            border-border/75
            bg-white
            px-4
          "
        >
          <Search
            className="
              h-[18px]
              w-[18px]
              shrink-0
              text-brand
            "
          />

          <input
            value={what}
            onChange={event => {
              setWhat(
                event.target.value
              );

              setSelectedFilter('');
            }}
            placeholder="Que recherchez-vous ?"
            className="
              min-w-0
              flex-1
              bg-transparent
              text-[14px]
              font-medium
              outline-none
              placeholder:font-normal
              placeholder:text-muted-foreground
              md:text-[13px]
              md:font-bold
            "
          />
        </label>

        <label
          className="
            mt-2
            flex
            min-h-[55px]
            items-center
            gap-3
            rounded-[1rem]
            border
            border-border/75
            bg-white
            px-4
          "
        >
          <MapPin
            className="
              h-[18px]
              w-[18px]
              shrink-0
              text-brand
            "
          />

          <input
            value={where}
            onChange={event =>
              setWhere(
                event.target.value
              )
            }
            placeholder="Où ? Ville ou code postal"
            className="
              min-w-0
              flex-1
              bg-transparent
              text-[14px]
              font-medium
              outline-none
              placeholder:font-normal
              placeholder:text-muted-foreground
              md:text-[13px]
              md:font-bold
            "
          />

          <button
            type="button"
            onClick={usePosition}
            aria-label="Utiliser ma position"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-brand
            "
          >
            <Crosshair
              className={`
                h-4
                w-4
                ${
                  locating
                    ? 'animate-pulse'
                    : ''
                }
              `}
            />
          </button>
        </label>

        <button
          type="submit"
          disabled={searching}
          className="
            mt-2
            min-h-[50px]
            w-full
            rounded-[0.95rem]
            bg-brand
            text-[15px]
            font-semibold
            text-white
            shadow-lg
            md:text-[13px]
            md:font-black
          "
        >
          {searching
            ? 'Recherche...'
            : 'Rechercher'}
        </button>
      </form>

      <div
        className="
          mt-[118px]
          px-1
          md:mt-9
          lg:hidden
        "
      >
        <p
          className="
            max-w-[365px]
            text-[23px]
            font-bold
            leading-[1.18]
            tracking-[-0.025em]
            text-[#71360f]
            md:text-[22px]
            md:font-black
            md:leading-[1.22]
          "
        >
          Découvrez une nouvelle façon
          <br />
          de rechercher avec LABEL MOTO
        </p>
      </div>

      <div
        className="
          mt-10
          grid
          grid-cols-4
          gap-2
          md:mt-5
          lg:hidden
        "
      >
        {QUICK_CHOICES.map(
          choice => {
            const Icon =
              choice.icon;

            return (
              <button
                key={choice.label}
                type="button"
                onClick={() => {
                  setWhat(
                    choice.value
                  );

                  setSelectedFilter(
                    choice.filter || ''
                  );
                }}
                className="
                  flex
                  min-h-[60px]
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  rounded-[1rem]
                  border
                  border-black/[0.025]
                  bg-white/[0.97]
                  shadow-[0_7px_20px_rgba(0,0,0,0.07)]
                "
              >
                <Icon
                  className="
                    h-4
                    w-4
                    text-brand
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-semibold
                    leading-tight
                    md:text-[8px]
                    md:font-black
                  "
                >
                  {choice.label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </div>
  );
}

function TechnicalSheets() {
  return (
    <Card
      title="Découvrez les fiches techniques moto par modèle"
    >
      <div
        className="
          flex
          snap-x
          snap-mandatory
          gap-2
          overflow-x-auto
          pb-2
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {TECH_SHEETS.map(
          sheet => (
            <Link
              key={sheet.href}
              href={sheet.href}
              className="
                w-[145px]
                shrink-0
                snap-start
                overflow-hidden
                rounded-[1rem]
                border
                border-border/60
                bg-white
              "
            >
              <div
                className="
                  relative
                  flex
                  h-[100px]
                  items-center
                  justify-center
                  overflow-hidden
                  bg-gradient-to-b
                  from-muted/45
                  to-white
                "
              >
                {sheet.image ? (
                  <img
                    src={sheet.image}
                    alt={`${sheet.brand} ${sheet.model}`}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-contain
                      p-1
                    "
                  />
                ) : (
                  <Bike
                    className="
                      h-12
                      w-12
                      text-foreground/70
                    "
                  />
                )}
              </div>

              <div
                className="
                  p-3
                "
              >
                <span
                  className="
                    block
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-brand
                  "
                >
                  {sheet.brand}
                </span>

                <div
                  className="
                    mt-1
                    flex
                    items-center
                    justify-between
                    gap-2
                  "
                >
                  <strong
                    className="
                      min-w-0
                      text-[10px]
                      font-semibold
                      leading-tight
                    "
                  >
                    {sheet.model}
                  </strong>

                  <ArrowRight
                    className="
                      h-3
                      w-3
                      shrink-0
                      text-brand
                    "
                  />
                </div>
              </div>
            </Link>
          )
        )}
      </div>

      <Link
        href="/entretien#fiches-par-modele"
        className="
          mt-3
          flex
          items-center
          justify-end
          gap-1
          text-[8px]
          font-bold
          uppercase
          text-brand
        "
      >
        Voir toutes les fiches

        <ArrowRight
          className="
            h-3
            w-3
          "
        />
      </Link>
    </Card>
  );
}

function SmallEditorialCard({
  pinSide,
  icon: Icon,
  title,
  text,
  cta,
  href,
}: {
  pinSide: 'left' | 'right';
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  text: string;
  cta: string;
  href: string;
}) {
  return (
    <div
      className="
        relative
        rounded-[1.45rem]
        border
        border-black/[0.035]
        bg-white/[0.97]
        p-4
        shadow-[0_16px_42px_rgba(0,0,0,0.08)]
      "
    >
      <RoadPin
        side={pinSide}
      />

      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-brand/10
          "
        >
          <Icon
            className="
              h-5
              w-5
              text-brand
            "
          />
        </div>

        <div
          className="
            min-w-0
          "
        >
          <h3
            className="
              text-[13px]
              font-black
            "
          >
            {title}
          </h3>

          <p
            className="
              mt-2
              text-[9px]
              font-semibold
              leading-relaxed
              text-muted-foreground
            "
          >
            {text}
          </p>

          <Link
            href={href}
            className="
              mt-3
              inline-flex
              items-center
              gap-1
              text-[8px]
              font-black
              uppercase
              text-brand
            "
          >
            {cta}

            <ArrowRight
              className="
                h-3
                w-3
              "
            />
          </Link>
        </div>
      </div>
    </div>
  );
}


function BottomBarScrollController() {
  useEffect(() => {
    const mobileMedia =
      window.matchMedia(
        '(max-width: 767px)'
      );

    const searchZone =
      document.querySelector<HTMLElement>(
        '[data-home-search-zone="true"]'
      );

    if (!searchZone) {
      return;
    }

    let bottomBar:
      | HTMLElement
      | null = null;

    let animationFrame:
      | number
      | null = null;

    let mutationObserver:
      | MutationObserver
      | null = null;

    function normalizeText(
      value: string | null
    ) {
      return (
        value || ''
      )
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();
    }

    function findBottomBar() {
      const links =
        Array.from(
          document.querySelectorAll<
            HTMLAnchorElement
          >('a')
        );

      const accueilLink =
        links.find(link => {
          const text =
            normalizeText(
              link.textContent
            );

          return (
            text === 'ACCUEIL' ||
            text.endsWith(' ACCUEIL')
          );
        });

      if (!accueilLink) {
        return null;
      }

      let element:
        | HTMLElement
        | null =
          accueilLink;

      while (
        element &&
        element !== document.body
      ) {
        const text =
          normalizeText(
            element.textContent
          );

        const containsMenu =
          text.includes('ACCUEIL') &&
          text.includes('CARTE') &&
          text.includes('ENTRETIEN') &&
          text.includes('CONSEILS');

        if (containsMenu) {
          const styles =
            window.getComputedStyle(
              element
            );

          const rect =
            element.getBoundingClientRect();

          const fixedAtBottom =
            (
              styles.position ===
                'fixed' ||
              styles.position ===
                'sticky'
            ) &&
            rect.bottom >=
              window.innerHeight - 24;

          if (fixedAtBottom) {
            return element;
          }
        }

        element =
          element.parentElement;
      }

      return null;
    }

    function prepareBar(
      bar: HTMLElement
    ) {
      bar.style.transition =
        [
          'opacity 240ms ease',
          'transform 280ms ease',
        ].join(', ');

      bar.style.willChange =
        'opacity, transform';
    }

    function hideBar() {
      if (!bottomBar) {
        return;
      }

      bottomBar.style.opacity =
        '0';

      bottomBar.style.transform =
        'translateY(110%)';

      bottomBar.style.pointerEvents =
        'none';

      bottomBar.setAttribute(
        'aria-hidden',
        'true'
      );
    }

    function showBar() {
      if (!bottomBar) {
        return;
      }

      bottomBar.style.opacity =
        '1';

      bottomBar.style.transform =
        'translateY(0)';

      bottomBar.style.pointerEvents =
        'auto';

      bottomBar.removeAttribute(
        'aria-hidden'
      );
    }

    function restoreBar() {
      if (!bottomBar) {
        return;
      }

      bottomBar.style.opacity =
        '';

      bottomBar.style.transform =
        '';

      bottomBar.style.pointerEvents =
        '';

      bottomBar.style.transition =
        '';

      bottomBar.style.willChange =
        '';

      bottomBar.removeAttribute(
        'aria-hidden'
      );
    }

    function updateVisibility() {
      if (!bottomBar) {
        bottomBar =
          findBottomBar();

        if (bottomBar) {
          prepareBar(
            bottomBar
          );
        }
      }

      if (!bottomBar) {
        return;
      }

      if (!mobileMedia.matches) {
        restoreBar();
        return;
      }

      const searchRect =
        searchZone.getBoundingClientRect();

      /*
       * La barre apparaît seulement lorsque
       * l'intégralité de la zone Recherche
       * est passée au-dessus de l'écran.
       */
      const searchHasLeftScreen =
        searchRect.bottom <= 0;

      if (searchHasLeftScreen) {
        showBar();
      }
      else {
        hideBar();
      }
    }

    function requestUpdate() {
      if (
        animationFrame !== null
      ) {
        return;
      }

      animationFrame =
        window.requestAnimationFrame(
          () => {
            animationFrame =
              null;

            updateVisibility();
          }
        );
    }

    /*
     * Recherche immédiatement la barre.
     */
    bottomBar =
      findBottomBar();

    if (bottomBar) {
      prepareBar(
        bottomBar
      );

      updateVisibility();
    }
    else {
      /*
       * Si la navigation est montée
       * légèrement après la homepage,
       * on attend son apparition.
       */
      mutationObserver =
        new MutationObserver(
          () => {
            if (bottomBar) {
              return;
            }

            bottomBar =
              findBottomBar();

            if (bottomBar) {
              prepareBar(
                bottomBar
              );

              updateVisibility();

              mutationObserver
                ?.disconnect();
            }
          }
        );

      mutationObserver.observe(
        document.body,
        {
          childList: true,
          subtree: true,
        }
      );
    }

    window.addEventListener(
      'scroll',
      requestUpdate,
      {
        passive: true,
      }
    );

    window.addEventListener(
      'resize',
      requestUpdate
    );

    mobileMedia.addEventListener(
      'change',
      requestUpdate
    );

    /*
     * Contrôle initial après hydratation.
     */
    requestUpdate();

    return () => {
      window.removeEventListener(
        'scroll',
        requestUpdate
      );

      window.removeEventListener(
        'resize',
        requestUpdate
      );

      mobileMedia.removeEventListener(
        'change',
        requestUpdate
      );

      mutationObserver
        ?.disconnect();

      if (
        animationFrame !== null
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );
      }

      restoreBar();
    };
  }, []);

  return null;
}

function DesktopMaintenanceSheetsSection() {
  const scrollSheets = (
    direction: 'left' | 'right'
  ) => {
    const container =
      document.getElementById(
        'desktop-tech-sheets-scroll'
      );

    container?.scrollBy({
      left:
        direction === 'right'
          ? 520
          : -520,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-white
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-20
          xl:px-12
          xl:py-24
          2xl:px-16
        "
      >
        <div
          className="
            mb-9
            flex
            items-end
            justify-between
            gap-8
          "
        >
          <div>
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-brand
              "
            >
              Entretien & modèles
            </span>

            <h2
              className="
                mt-2
                text-[36px]
                font-bold
                leading-[1.05]
                tracking-[-0.035em]
                xl:text-[42px]
              "
            >
              Entretenir et mieux connaître
              votre moto
            </h2>
          </div>

          <Link
            href="/entretien#fiches-par-modele"
            className="
              flex
              items-center
              gap-1.5
              text-[12px]
              font-semibold
              text-brand
              hover:underline
            "
          >
            Voir toutes les fiches

            <ArrowRight
              className="
                h-4
                w-4
              "
            />
          </Link>
        </div>

        <div
          className="
            grid
            grid-cols-[minmax(330px,0.78fr)_minmax(0,1.6fr)]
            gap-7
            xl:grid-cols-[minmax(380px,0.8fr)_minmax(0,1.65fr)]
          "
        >
          {/* ===============================================
              ENTRETIEN
          ================================================ */}

          <Link
            href="/entretien"
            className="
              group
              relative
              min-h-[440px]
              overflow-hidden
              rounded-[1.8rem]
              bg-black
            "
          >
            <img
              src="/images/motard-entretien-page.webp"
              alt="Entretien moto"
              loading="lazy"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.025]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/80
                via-black/20
                to-black/[0.02]
              "
            />

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                p-7
                text-white
                xl:p-8
              "
            >
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-white/75
                "
              >
                Votre moto au quotidien
              </span>

              <h3
                className="
                  mt-2
                  text-[31px]
                  font-bold
                  tracking-[-0.035em]
                "
              >
                Entretien moto
              </h3>

              <p
                className="
                  mt-3
                  max-w-[360px]
                  text-[13px]
                  leading-[1.5]
                  text-white/80
                "
              >
                Révisions, maintenance et coûts
                d’entretien par modèle.
              </p>

              <span
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-5
                  py-3
                  text-[12px]
                  font-semibold
                  text-black
                "
              >
                Voir l’entretien

                <ArrowRight
                  className="
                    h-4
                    w-4
                  "
                />
              </span>
            </div>
          </Link>

          {/* ===============================================
              FICHES MOTO
          ================================================ */}

          <div
            className="
              min-w-0
              rounded-[1.8rem]
              bg-[#f4f5f6]
              p-6
              xl:p-7
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-6
              "
            >
              <div>
                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-brand
                  "
                >
                  Par modèle
                </span>

                <h3
                  className="
                    mt-2
                    text-[27px]
                    font-bold
                    tracking-[-0.03em]
                  "
                >
                  Fiches techniques moto
                </h3>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    scrollSheets('left')
                  }
                  aria-label="Fiches précédentes"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/[0.07]
                    bg-white
                    text-lg
                    transition-colors
                    hover:border-brand/30
                  "
                >
                  ←
                </button>

                <button
                  type="button"
                  onClick={() =>
                    scrollSheets('right')
                  }
                  aria-label="Fiches suivantes"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/[0.07]
                    bg-white
                    text-lg
                    transition-colors
                    hover:border-brand/30
                  "
                >
                  →
                </button>
              </div>
            </div>

            <div
              id="desktop-tech-sheets-scroll"
              className="
                mt-7
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                pb-2
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {TECH_SHEETS.map(sheet => (
                <Link
                  key={sheet.href}
                  href={sheet.href}
                  className="
                    group
                    w-[225px]
                    shrink-0
                    snap-start
                  "
                >
                  <div
                    className="
                      flex
                      h-[255px]
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-[1.35rem]
                      bg-white
                    "
                  >
                    {sheet.image ? (
                      <img
                        src={sheet.image}
                        alt={`${sheet.brand} ${sheet.model}`}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-contain
                          p-3
                          transition-transform
                          duration-300
                          group-hover:scale-[1.025]
                        "
                      />
                    ) : (
                      <Bike
                        className="
                          h-16
                          w-16
                          text-foreground/25
                        "
                      />
                    )}
                  </div>

                  <div
                    className="
                      pt-4
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-brand
                      "
                    >
                      {sheet.brand}
                    </span>

                    <div
                      className="
                        mt-1
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <strong
                        className="
                          text-[17px]
                          font-bold
                          leading-tight
                          tracking-[-0.02em]
                        "
                      >
                        {sheet.model}
                      </strong>

                      <ArrowRight
                        className="
                          mt-1
                          h-4
                          w-4
                          shrink-0
                          text-brand
                          transition-transform
                          group-hover:translate-x-1
                        "
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesktopGuidesSection() {
  const articles = [
    {
      image: '/images/achat-occasion.webp',
      category: 'Permis & A2',
      title: 'Quelle moto choisir pour débuter en A2 ?',
      href: '/info/meilleure-moto-a2-quelle-moto-choisir-pour-debuter',
    },
    {
      image: '/images/evitelespieges.webp',
      category: 'Achat',
      title: 'Acheter une moto d’occasion sans tomber dans les pièges',
      href: '/info/achat-moto-occasion-guide-complet-pour-eviter-les-pieges',
    },
    {
      image: '/images/casque-meilleur-casque-2026.webp',
      category: 'Équipement',
      title: 'Les meilleurs casques moto en 2026',
      href: '/info/meilleurs-casques-moto-2026',
    },
    {
      image: '/images/article-scooter-125.webp',
      category: 'Scooter 125',
      title: 'Quel scooter 125 choisir en 2026 ?',
      href: '/info/meilleur-scooter-125-2026-comparatif-complet',
    },
    {
      image: '/images/article-moto-125cc.webp',
      category: 'Moto 125',
      title: 'Les meilleures motos 125 cc en 2026',
      href: '/info/meilleures-motos-125cc-2026-guide-complet',
    },
  ];

  const scrollGuides = (
    direction: 'left' | 'right'
  ) => {
    const container =
      document.getElementById(
        'desktop-guides-scroll'
      );

    container?.scrollBy({
      left:
        direction === 'right'
          ? 650
          : -650,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-[#fbfcfd]
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-20
          xl:px-12
          xl:py-24
          2xl:px-16
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-8
          "
        >
          <div>
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-brand
              "
            >
              Le magazine LabelMoto
            </span>

            <h2
              className="
                mt-2
                text-[38px]
                font-bold
                tracking-[-0.04em]
                xl:text-[44px]
              "
            >
              Guides & conseils
            </h2>

            <p
              className="
                mt-3
                max-w-[640px]
                text-[15px]
                text-muted-foreground
              "
            >
              Conseils, comparatifs et dossiers
              pour mieux choisir et profiter de votre moto.
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <Link
              href="/info"
              className="
                mr-3
                text-[12px]
                font-semibold
                text-brand
                hover:underline
              "
            >
              Voir tous les guides
            </Link>

            <button
              type="button"
              onClick={() =>
                scrollGuides('left')
              }
              aria-label="Articles précédents"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.07]
                bg-white
                text-lg
              "
            >
              ←
            </button>

            <button
              type="button"
              onClick={() =>
                scrollGuides('right')
              }
              aria-label="Articles suivants"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.07]
                bg-white
                text-lg
              "
            >
              →
            </button>
          </div>
        </div>

        <div
          id="desktop-guides-scroll"
          className="
            mt-9
            flex
            snap-x
            snap-mandatory
            gap-5
            overflow-x-auto
            pb-3
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {articles.map(article => (
            <Link
              key={article.href}
              href={article.href}
              className="
                group
                w-[300px]
                shrink-0
                snap-start
                xl:w-[315px]
              "
            >
              <div
                className="
                  h-[205px]
                  overflow-hidden
                  rounded-[1.35rem]
                  bg-[#f1f2f3]
                "
              >
                <img
                  src={article.image}
                  alt={article.title}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-[1.025]
                  "
                />
              </div>

              <div
                className="
                  pt-4
                "
              >
                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-brand
                  "
                >
                  {article.category}
                </span>

                <h3
                  className="
                    mt-2
                    text-[17px]
                    font-bold
                    leading-[1.25]
                    tracking-[-0.02em]
                  "
                >
                  {article.title}
                </h3>

                <span
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-1.5
                    text-[12px]
                    font-semibold
                    text-foreground
                  "
                >
                  Lire l’article

                  <ArrowRight
                    className="
                      h-4
                      w-4
                      text-brand
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesktopProSection() {
  return (
    <section
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-white
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-24
          xl:px-12
          xl:py-28
          2xl:px-16
        "
      >
        <div
          className="
            grid
            grid-cols-[minmax(0,0.92fr)_minmax(520px,1.08fr)]
            items-center
            gap-14
            xl:gap-20
          "
        >
          {/* =================================================
              GAUCHE : TEXTE
          ================================================== */}

          <div
            className="
              max-w-[580px]
            "
          >
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.17em]
                text-brand
              "
            >
              LabelMoto pour les pros
            </span>

            <h2
              className="
                mt-4
                max-w-[570px]
                text-[43px]
                font-bold
                leading-[1.04]
                tracking-[-0.04em]
                text-foreground
                xl:text-[50px]
              "
            >
              Développez votre visibilité
              auprès des motards
            </h2>

            <p
              className="
                mt-6
                max-w-[540px]
                text-[16px]
                font-normal
                leading-[1.6]
                text-muted-foreground
                xl:text-[17px]
              "
            >
              Créez ou prenez le contrôle de votre fiche
              professionnelle et mettez votre activité en avant
              auprès des motards partout en France.
            </p>

            {/* PETITES PREUVES */}

            <div
              className="
                mt-7
                flex
                flex-wrap
                items-center
                gap-x-8
                gap-y-3
                text-[12px]
                font-semibold
                text-foreground/75
              "
            >
              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-brand
                  "
                />

                Visibilité nationale
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-brand
                  "
                />

                Recherche locale
              </span>

              <span
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-brand
                  "
                />

                Tous les métiers moto
              </span>
            </div>

            {/* CTA */}

            <div
              className="
                mt-9
                flex
                items-center
                gap-7
              "
            >
              <Link
                href="/login?callbackUrl=/pro/register"
                className="
                  inline-flex
                  min-h-[54px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[0.9rem]
                  bg-brand
                  px-7
                  text-[14px]
                  font-semibold
                  text-white
                  shadow-[0_10px_28px_rgba(0,0,0,0.08)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:opacity-90
                "
              >
                Créer ma fiche pro

                <ArrowRight
                  className="
                    h-4
                    w-4
                  "
                />
              </Link>

              <Link
                href="/pro/revendiquer"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  border-b
                  border-foreground/35
                  pb-1
                  text-[14px]
                  font-semibold
                  text-foreground
                  transition-colors
                  hover:border-brand
                  hover:text-brand
                "
              >
                Modifier ma fiche

                <ArrowRight
                  className="
                    h-4
                    w-4
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </Link>
            </div>
          </div>

          {/* =================================================
              DROITE : APERCU INTERFACE PRO
          ================================================== */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[1.7rem]
              bg-[#f2f3f4]
              shadow-[0_18px_55px_rgba(0,0,0,0.08)]
            "
          >
            <div
              className="
                relative
                aspect-[1.38/1]
                w-full
                overflow-hidden
              "
            >
              <img
                src="/images/apercufiche.webp"
                alt="Aperçu de l'interface professionnelle LabelMoto"
                loading="lazy"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-500
                  hover:scale-[1.015]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function DesktopUniverseSection() {
  const manufacturers = [
    'Honda',
    'Yamaha',
    'BMW',
    'Kawasaki',
    'CFMOTO',
    'VOGE',
    'QJ Motor',
    'KOVE',
  ];

  const equipmentBrands = [
    'Maxxess',
    'Cardy',
    'Speedway',
  ];

  return (
    <section
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-[#fbfcfd]
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-20
          xl:px-12
          xl:py-24
          2xl:px-16
        "
      >
        {/* =================================================
            PARTIE HAUTE
        ================================================== */}

        <div
          className="
            grid
            grid-cols-[minmax(0,0.9fr)_minmax(500px,1.1fr)]
            items-stretch
            gap-12
            xl:gap-16
          "
        >
          {/* =================================================
              GAUCHE : UNIVERS
          ================================================== */}

          <div
            className="
              flex
              flex-col
              justify-center
              py-4
            "
          >
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.17em]
                text-brand
              "
            >
              Le réseau LabelMoto
            </span>

            <h2
              className="
                mt-4
                max-w-[600px]
                text-[44px]
                font-bold
                leading-[1.02]
                tracking-[-0.04em]
                text-foreground
                xl:text-[50px]
              "
            >
              Tout l’univers moto
              <br />
              au même endroit
            </h2>

            <p
              className="
                mt-5
                max-w-[570px]
                text-[16px]
                font-normal
                leading-[1.5]
                text-muted-foreground
                xl:text-[17px]
              "
            >
              Concessions, garages, artisans et spécialistes
              partout en France.
            </p>

            {/* ===============================================
                PREUVES
            ================================================ */}

            <div
              className="
                mt-9
                grid
                max-w-[620px]
                grid-cols-3
                gap-3
              "
            >
              <div
                className="
                  rounded-[1.15rem]
                  bg-white
                  p-4
                  shadow-[0_7px_24px_rgba(0,0,0,0.045)]
                "
              >
                <Users
                  className="
                    h-5
                    w-5
                    text-brand
                  "
                />

                <strong
                  className="
                    mt-4
                    block
                    text-[20px]
                    font-bold
                    leading-none
                  "
                >
                  5 900+
                </strong>

                <span
                  className="
                    mt-2
                    block
                    text-[11px]
                    leading-snug
                    text-muted-foreground
                  "
                >
                  professionnels référencés
                </span>
              </div>

              <div
                className="
                  rounded-[1.15rem]
                  bg-white
                  p-4
                  shadow-[0_7px_24px_rgba(0,0,0,0.045)]
                "
              >
                <Map
                  className="
                    h-5
                    w-5
                    text-brand
                  "
                />

                <strong
                  className="
                    mt-4
                    block
                    text-[20px]
                    font-bold
                    leading-none
                  "
                >
                  France
                </strong>

                <span
                  className="
                    mt-2
                    block
                    text-[11px]
                    leading-snug
                    text-muted-foreground
                  "
                >
                  couverture nationale
                </span>
              </div>

              <div
                className="
                  rounded-[1.15rem]
                  bg-white
                  p-4
                  shadow-[0_7px_24px_rgba(0,0,0,0.045)]
                "
              >
                <Wrench
                  className="
                    h-5
                    w-5
                    text-brand
                  "
                />

                <strong
                  className="
                    mt-4
                    block
                    text-[20px]
                    font-bold
                    leading-none
                  "
                >
                  Tous
                </strong>

                <span
                  className="
                    mt-2
                    block
                    text-[11px]
                    leading-snug
                    text-muted-foreground
                  "
                >
                  les métiers du deux-roues
                </span>
              </div>
            </div>
          </div>

          {/* =================================================
              DROITE : TROUVER LE BON PRO
          ================================================== */}

          <div
            className="
              rounded-[2rem]
              bg-[#f2f3f4]
              p-7
              xl:p-8
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-6
              "
            >
              <div>
                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-brand
                  "
                >
                  Recherche rapide
                </span>

                <h3
                  className="
                    mt-2
                    text-[34px]
                    font-bold
                    leading-[1.05]
                    tracking-[-0.035em]
                    xl:text-[38px]
                  "
                >
                  Trouver le bon pro
                </h3>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                "
              >
                <MapPin
                  className="
                    h-5
                    w-5
                    text-brand
                  "
                />
              </div>
            </div>

            <div
              className="
                mt-7
                grid
                grid-cols-2
                gap-3
              "
            >
              {PRO_CHOICES.map(choice => {
                const Icon = choice.icon;

                return (
                  <Link
                    key={choice.label}
                    href={choice.href}
                    className="
                      group
                      flex
                      min-h-[62px]
                      items-center
                      gap-3
                      rounded-[1rem]
                      bg-white
                      px-4
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:shadow-[0_7px_20px_rgba(0,0,0,0.06)]
                    "
                  >
                    <Icon
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-brand
                      "
                    />

                    <span
                      className="
                        min-w-0
                        flex-1
                        text-[12px]
                        font-semibold
                        leading-tight
                      "
                    >
                      {choice.label}
                    </span>

                    <ArrowRight
                      className="
                        h-3.5
                        w-3.5
                        shrink-0
                        text-brand
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </Link>
                );
              })}
            </div>

            <Link
              href="/map"
              className="
                mt-6
                flex
                min-h-[50px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-[1rem]
                bg-brand
                px-5
                text-[13px]
                font-semibold
                text-white
                transition-opacity
                hover:opacity-90
              "
            >
              Explorer tous les professionnels

              <ArrowRight
                className="
                  h-4
                  w-4
                "
              />
            </Link>
          </div>
        </div>

        {/* =================================================
            MARQUES - PLEINE LARGEUR
        ================================================== */}

        <div
          className="
            mt-16
            border-t
            border-black/[0.06]
            pt-10
          "
        >
          <div
            className="
              flex
              items-end
              justify-between
              gap-8
            "
          >
            <div>
              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-brand
                "
              >
                Le réseau
              </span>

              <h3
                className="
                  mt-2
                  text-[28px]
                  font-bold
                  tracking-[-0.03em]
                  xl:text-[32px]
                "
              >
                Quelques marques présentes
              </h3>
            </div>

            <Link
              href="/map"
              className="
                flex
                items-center
                gap-1.5
                text-[12px]
                font-semibold
                text-brand
                hover:underline
              "
            >
              Voir toutes

              <ArrowRight
                className="
                  h-3.5
                  w-3.5
                "
              />
            </Link>
          </div>

          {/* ===============================================
              CONSTRUCTEURS
          ================================================ */}

          <div
            className="
              mt-8
            "
          >
            <h4
              className="
                text-[13px]
                font-bold
                text-foreground
              "
            >
              Constructeurs
            </h4>

            <div
              className="
                mt-4
                grid
                grid-cols-4
                gap-3
              "
            >
              {manufacturers.map(brand => (
                <Link
                  key={brand}
                  href={`/map?search=${encodeURIComponent(brand)}`}
                  className="
                    flex
                    h-[66px]
                    items-center
                    justify-center
                    rounded-[1rem]
                    border
                    border-black/[0.055]
                    bg-white
                    px-4
                    text-center
                    shadow-[0_4px_16px_rgba(0,0,0,0.025)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-brand/30
                    hover:shadow-[0_8px_22px_rgba(0,0,0,0.055)]
                  "
                >
                  <span
                    className="
                      text-[14px]
                      font-bold
                      tracking-[-0.015em]
                    "
                  >
                    {brand}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ===============================================
              EQUIPEMENTIERS / ENSEIGNES
          ================================================ */}

          <div
            className="
              mt-8
            "
          >
            <h4
              className="
                text-[13px]
                font-bold
                text-foreground
              "
            >
              Équipementiers & enseignes
            </h4>

            <div
              className="
                mt-4
                grid
                max-w-[820px]
                grid-cols-3
                gap-3
              "
            >
              {equipmentBrands.map(brand => (
                <Link
                  key={brand}
                  href={`/map?search=${encodeURIComponent(brand)}`}
                  className="
                    flex
                    h-[66px]
                    items-center
                    justify-center
                    rounded-[1rem]
                    border
                    border-black/[0.055]
                    bg-white
                    px-4
                    text-center
                    shadow-[0_4px_16px_rgba(0,0,0,0.025)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-brand/30
                    hover:shadow-[0_8px_22px_rgba(0,0,0,0.055)]
                  "
                >
                  <span
                    className="
                      text-[14px]
                      font-bold
                      tracking-[-0.015em]
                    "
                  >
                    {brand}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function DesktopDiscoverySection() {
  const descriptions: Record<string, string> = {
    Concessions:
      'Retrouvez les concessions moto et les marques près de chez vous.',
    Garages:
      'Trouvez rapidement un atelier ou un mécanicien pour votre moto.',
    Associations:
      'Découvrez les clubs et associations de motards autour de vous.',
    'Relais motards':
      'Repérez les étapes et adresses pensées pour accueillir les motards.',
  };

  return (
    <section
      data-desktop-discovery="true"
      className="
        relative
        left-1/2
        z-20
        hidden
        w-screen
        -translate-x-1/2
        bg-white
        lg:block
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1500px]
          px-8
          py-16
          xl:px-12
          xl:py-20
          2xl:px-16
        "
      >
        <h2
          className="
            max-w-[920px]
            text-[50px]
            font-bold
            leading-[1]
            tracking-[-0.04em]
            text-foreground
            xl:text-[58px]
          "
        >
          Découvrez une nouvelle façon
          <br />
          de rechercher avec LABEL MOTO
        </h2>

        <div
          className="
            mt-10
            grid
            grid-cols-4
            gap-4
            xl:gap-5
          "
        >
          {QUICK_CHOICES.map(choice => {
            const Icon = choice.icon;

            const href = choice.filter
              ? `/map?filter=${encodeURIComponent(choice.filter)}`
              : `/map?search=${encodeURIComponent(choice.value)}`;

            return (
              <Link
                key={choice.label}
                href={href}
                className="
                  group
                  relative
                  min-h-[205px]
                  overflow-hidden
                  rounded-[1.4rem]
                  bg-[#f3f3f3]
                  p-6
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)]
                "
              >
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                  "
                >
                  <Icon
                    className="
                      h-5
                      w-5
                      text-brand
                    "
                  />
                </div>

                <h3
                  className="
                    mt-7
                    text-[20px]
                    font-bold
                    tracking-[-0.02em]
                    text-foreground
                  "
                >
                  {choice.label}
                </h3>

                <p
                  className="
                    mt-2
                    max-w-[260px]
                    text-[13px]
                    font-normal
                    leading-[1.45]
                    text-muted-foreground
                  "
                >
                  {descriptions[choice.label]}
                </p>

                <span
                  className="
                    absolute
                    bottom-5
                    right-5
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-brand
                    transition-transform
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  <ArrowRight
                    className="
                      h-4
                      w-4
                    "
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function DesktopFranceVisual() {
  return (
    <div
      className="
        relative
        h-[430px]
        w-full
        overflow-hidden
        rounded-[2rem]
        bg-[#f1f3f4]
        xl:h-[470px]
      "
    >
      <div
        className="
          absolute
          left-8
          top-7
          z-10
        "
      >
        <span
          className="
            text-[11px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-muted-foreground
          "
        >
          Le réseau LabelMoto
        </span>

        <p
          className="
            mt-1
            text-[15px]
            font-semibold
            text-foreground
          "
        >
          Des professionnels partout en France
        </p>
      </div>

      <svg
        viewBox="0 0 620 560"
        role="img"
        aria-label="Illustration de la France et du réseau LabelMoto"
        className="
          absolute
          inset-0
          h-full
          w-full
        "
      >
        {/* Ombre douce */}
        <path
          d="
            M306 73
            L394 92
            L463 154
            L454 236
            L496 315
            L463 403
            L375 470
            L292 500
            L211 462
            L151 399
            L126 313
            L148 224
            L195 145
            L258 96
            Z
          "
          fill="rgba(0,0,0,0.05)"
          transform="translate(8 10)"
        />

        {/* France stylisee */}
        <path
          d="
            M306 63
            L394 82
            L463 144
            L454 226
            L496 305
            L463 393
            L375 460
            L292 490
            L211 452
            L151 389
            L126 303
            L148 214
            L195 135
            L258 86
            Z
          "
          fill="white"
          stroke="rgba(17,24,39,0.10)"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Corse */}
        <path
          d="
            M457 449
            C469 457 474 474 469 493
            C466 505 459 514 453 520
            C449 505 447 491 449 476
            C450 463 453 455 457 449
            Z
          "
          fill="white"
          stroke="rgba(17,24,39,0.10)"
          strokeWidth="2"
        />

        {/* Route LabelMoto */}
        <path
          d="
            M323 103
            C278 145 350 176 310 215
            C270 252 341 284 304 321
            C268 357 325 385 289 438
          "
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          className="text-brand"
        />

        {/* Route secondaire */}
        <path
          d="
            M310 215
            C357 232 397 257 428 294
          "
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-brand/45"
        />

        {/* Marqueurs */}
        {[
          [323, 103],
          [310, 215],
          [428, 294],
          [304, 321],
          [289, 438],
        ].map(([cx, cy]) => (
          <g
            key={`${cx}-${cy}`}
          >
            <circle
              cx={cx}
              cy={cy}
              r="13"
              fill="white"
              stroke="rgba(17,24,39,0.08)"
              strokeWidth="2"
            />

            <circle
              cx={cx}
              cy={cy}
              r="7"
              fill="currentColor"
              className="text-brand"
            />
          </g>
        ))}
      </svg>

      {/* Régions discrètes */}
      <span
        className="
          absolute
          right-[18%]
          top-[27%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Hauts-de-France
      </span>

      <span
        className="
          absolute
          right-[24%]
          top-[39%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Île-de-France
      </span>

      <span
        className="
          absolute
          left-[17%]
          top-[61%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Nouvelle-Aquitaine
      </span>

      <span
        className="
          absolute
          right-[12%]
          top-[66%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Auvergne-Rhône-Alpes
      </span>

      <span
        className="
          absolute
          bottom-[13%]
          left-[34%]
          text-[10px]
          font-bold
          uppercase
          tracking-[0.13em]
          text-foreground/[0.13]
        "
      >
        Occitanie
      </span>

      <div
        className="
          absolute
          bottom-7
          right-7
          flex
          items-center
          gap-3
          rounded-full
          bg-white
          px-5
          py-3
          shadow-[0_12px_35px_rgba(0,0,0,0.09)]
        "
      >
        <MapPin
          className="
            h-4
            w-4
            text-brand
          "
        />

        <span
          className="
            text-[12px]
            font-semibold
          "
        >
          Toute la France couverte
        </span>
      </div>
    </div>
  );
}
export default function HomepageRoad() {
  return (
    <>
      <BottomBarScrollController />

      <main
      className="
        relative
        isolate
        overflow-hidden
        bg-[#fbfcfd]
        pb-0
      "
    >
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[430px]
          overflow-hidden
          bg-[#fbfcfd]
          lg:overflow-visible
        "
      >
        <RouteBackdrop />
        <MobileRegionLabels />

        {/* ==================================================
            HERO
        =================================================== */}

        <section
          className="
            relative
            z-10
            min-h-[620px]
            lg:hidden
            px-5
            pb-10
            pt-5
          "
        >

          <header
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div
              className="
                w-[150px]
              "
            >
              <LabelMotoLogo
                noBubble
              />
            </div>

            <UserMenu />
          </header>

          <div
            className="
              mx-auto
              mt-14
              w-full
              max-w-[370px]
            "
          >
            <h1
              className="
                max-w-[350px]
                text-[33px]
                font-bold
                leading-[1.04]
                tracking-[-0.035em]
                md:text-[34px]
                md:font-black
                md:leading-[0.97]
                md:tracking-[-0.045em]
              "
            >
              Trouvez un pro moto
              près de vous
            </h1>

            <p
              className="
                mt-4
                max-w-[330px]
                text-[14px]
                font-normal
                leading-[1.45]
                text-muted-foreground
                md:text-[12px]
                md:font-semibold
                md:leading-relaxed
              "
            >
              Le réseau de référence
              pour entretenir, équiper
              et vivre votre passion moto.
            </p>

            <div
              data-home-search-zone="true"
              className="
                mt-7
              "
            >
              <HeroSearch />
            </div>
          </div>
        </section>


        {/* ==================================================
            HERO DESKTOP
        =================================================== */}

        <section
          data-desktop-home-hero="true"
          className="
            relative
            left-1/2
            z-20
            hidden
            w-screen
            min-h-[100svh]
            -translate-x-1/2
            bg-[#fbfcfd]
            lg:block
          "
        >
          <div
            className="
              mx-auto
              w-full
              max-w-[1500px]
              px-8
              xl:px-12
              2xl:px-16
            "
          >
            {/* HEADER DESKTOP */}
            <header
              className="
                flex
                h-[76px]
                items-center
                justify-between
                border-b
                border-black/[0.045]
              "
            >
              <div
                className="
                  w-[175px]
                  shrink-0
                "
              >
                <LabelMotoLogo
                  noBubble
                />
              </div>

              <nav
                aria-label="Navigation principale"
                className="
                  ml-10
                  hidden
                  items-center
                  gap-8
                  xl:flex
                "
              >
                <Link
                  href="/map"
                  className="
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:text-brand
                  "
                >
                  Carte
                </Link>

                <Link
                  href="/entretien"
                  className="
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:text-brand
                  "
                >
                  Entretien
                </Link>

                <Link
                  href="/info"
                  className="
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:text-brand
                  "
                >
                  Guides & conseils
                </Link>

                <Link
                  href="/entretien#fiches-par-modele"
                  className="
                    text-[14px]
                    font-semibold
                    transition-colors
                    hover:text-brand
                  "
                >
                  Fiches moto
                </Link>
              </nav>

              <UserMenu />
            </header>

            {/* HERO 2 COLONNES */}
            <div
              className="
                grid
                min-h-[calc(100svh-76px)]
                grid-cols-[minmax(0,0.92fr)_minmax(480px,1.08fr)]
                items-center
                gap-10
                py-6
                xl:gap-14
                xl:py-7
              "
            >
              {/* GAUCHE */}
              <div
                className="
                  max-w-[510px]
                "
              >
                <span
                  className="
                    inline-flex
                    rounded-full
                    bg-brand/10
                    px-3.5
                    py-1.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-brand
                  "
                >
                  Le réseau moto près de vous
                </span>

                <h1
                  className="
                    mt-5
                    max-w-[510px]
                    text-[44px]
                    font-bold
                    leading-[1]
                    tracking-[-0.04em]
                    text-foreground
                    xl:text-[50px]
                  "
                >
                  Trouvez un pro moto
                  <br />
                  près de vous
                </h1>

                <p
                  className="
                    mt-4
                    max-w-[480px]
                    text-[15px]
                    font-normal
                    leading-[1.5]
                    text-muted-foreground
                    xl:text-[16px]
                  "
                >
                  Le réseau de référence pour entretenir,
                  équiper et vivre votre passion moto.
                </p>

                <div
                  data-home-search-zone="true"
                  className="
                    mt-6
                    w-full
                    max-w-[480px]
                  "
                >
                  <HeroSearch />
                </div>
              </div>

              {/* DROITE */}
              <DesktopFranceVisual />
            </div>
          </div>
        </section>
        {/* ==================================================
            DECOUVERTE DESKTOP
        =================================================== */}

        <DesktopDiscoverySection />

        {/* ==================================================
            UNIVERS DESKTOP
        =================================================== */}

        <DesktopUniverseSection />

        {/* ==================================================
            ENTRETIEN + FICHES DESKTOP
        =================================================== */}

        <DesktopMaintenanceSheetsSection />

        {/* ==================================================
            GUIDES DESKTOP
        =================================================== */}

        <DesktopGuidesSection />

        {/* ==================================================
            ESPACE PRO DESKTOP
        =================================================== */}

        <DesktopProSection />

        {/* ==================================================
            VERSION MOBILE / TABLETTE DES BLOCS SUIVANTS
        =================================================== */}

        <div className="lg:hidden">
        {/* ==================================================
            UNIVERS
        =================================================== */}

        <Stage
          side="left"
          pinSide="left"
          height="normal"
          desktopHidden
        >
          <Card
            title="Tout l’univers moto au même endroit"
          >
            <div
              className="
                space-y-3
                text-[11px]
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Users
                  className="
                    h-4
                    w-4
                    text-brand
                  "
                />

                <span>
                  <strong>
                    5 900+
                  </strong>{' '}
                  professionnels référencés
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Map
                  className="
                    h-4
                    w-4
                    text-brand
                  "
                />

                <span>
                  Toute la France couverte
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <Settings
                  className="
                    h-4
                    w-4
                    text-brand
                  "
                />

                <span>
                  De nombreux métiers
                  du deux-roues
                </span>
              </div>
            </div>

            <div
              className="
                mt-5
                grid
                grid-cols-3
                border-t
                pt-4
              "
            >
              {[
                {
                  icon: Clock3,
                  text: 'Gain de temps',
                },
                {
                  icon: ShieldCheck,
                  text: 'Données vérifiées',
                },
                {
                  icon: MapPin,
                  text: 'Recherche locale',
                },
              ].map(item => {
                const Icon =
                  item.icon;

                return (
                  <div
                    key={item.text}
                    className="
                      text-center
                    "
                  >
                    <Icon
                      className="
                        mx-auto
                        h-4
                        w-4
                        text-brand
                      "
                    />

                    <span
                      className="
                        mt-1
                        block
                        text-[7px]
                        font-black
                        leading-tight
                      "
                    >
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </Stage>

        {/* ==================================================
            ENTRETIEN
        =================================================== */}

        <Stage
          side="right"
          pinSide="right"
          height="compact"
        >
          <Card
            title="Entretien moto"
          >
            <p
              className="
                text-[10px]
                font-semibold
                text-muted-foreground
              "
            >
              Révisions, maintenance
              et coûts par modèle.
            </p>

            <div
              className="
                mt-4
                space-y-2
              "
            >
              <Link
                href="/entretien"
                className="
                  flex
                  min-h-[42px]
                  items-center
                  justify-between
                  rounded-xl
                  bg-muted/55
                  px-3
                  text-[9px]
                  font-black
                "
              >
                Yamaha MT-07

                <ArrowRight
                  className="
                    h-3
                    w-3
                    text-brand
                  "
                />
              </Link>

              <Link
                href="/entretien"
                className="
                  flex
                  min-h-[42px]
                  items-center
                  justify-between
                  rounded-xl
                  bg-muted/55
                  px-3
                  text-[9px]
                  font-black
                "
              >
                Honda XL750 Transalp

                <ArrowRight
                  className="
                    h-3
                    w-3
                    text-brand
                  "
                />
              </Link>
            </div>

            <Link
              href="/entretien"
              className="
                mt-4
                inline-flex
                items-center
                gap-1
                text-[8px]
                font-black
                uppercase
                text-brand
              "
            >
              Voir l’entretien

              <ArrowRight
                className="
                  h-3
                  w-3
                "
              />
            </Link>
          </Card>
        </Stage>

        {/* ==================================================
            TROUVER PRO
        =================================================== */}

        <Stage
          side="left"
          pinSide="left"
          height="normal"
          desktopHidden
        >
          <Card
            title="Trouver le bon pro"
          >
            <div
              className="
                space-y-1
              "
            >
              {PRO_CHOICES.map(
                choice => {
                  const Icon =
                    choice.icon;

                  return (
                    <Link
                      key={choice.label}
                      href={choice.href}
                      className="
                        flex
                        min-h-[34px]
                        items-center
                        gap-2
                        rounded-lg
                        px-1
                        text-[8px]
                        font-black
                        hover:bg-brand/5
                      "
                    >
                      <Icon
                        className="
                          h-3.5
                          w-3.5
                          shrink-0
                          text-brand
                        "
                      />

                      <span
                        className="
                          flex-1
                        "
                      >
                        {choice.label}
                      </span>

                      <ArrowRight
                        className="
                          h-3
                          w-3
                          text-brand
                        "
                      />
                    </Link>
                  );
                }
              )}
            </div>
          </Card>
        </Stage>

        {/* ==================================================
            GRAND BLOC FICHES
        =================================================== */}

        <Stage
          side="center"
          pinSide="left"
          wide
          height="large"
        >
          <TechnicalSheets />
        </Stage>

        {/* ==================================================
            EDITORIAL
        =================================================== */}

        <section
          className="
            relative
            z-10
            flex
            min-h-[320px]
            items-center
            px-4
          "
        >
          <div
            className="
              grid
              w-full
              grid-cols-2
              gap-3
            "
          >
            <SmallEditorialCard
              pinSide="left"
              icon={BookOpen}
              title="Guides & conseils"
              text="Nos guides pour entretenir, choisir et profiter de votre moto."
              cta="Voir les guides"
              href="/info"
            />

          </div>
        </section>

        {/* ==================================================
            ESPACE PRO
        =================================================== */}

        <Stage
          side="center"
          pinSide="left"
          wide
          height="compact"
        >
          <div
            className="
              rounded-[1.6rem]
              border
              border-black/[0.035]
              bg-white/[0.97]
              p-5
              shadow-[0_18px_48px_rgba(0,0,0,0.085)]
            "
          >
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-brand/10
                "
              >
                <Users
                  className="
                    h-6
                    w-6
                    text-brand
                  "
                />
              </div>

              <div
                className="
                  min-w-0
                "
              >
                <h2
                  className="
                    text-[15px]
                    font-black
                  "
                >
                  Espace pro,
                  rejoignez le réseau
                </h2>

                <p
                  className="
                    mt-2
                    text-[9px]
                    font-semibold
                    leading-relaxed
                    text-muted-foreground
                  "
                >
                  Développez votre visibilité
                  et connectez-vous à des
                  milliers de motards partout
                  en France.
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                grid
                grid-cols-2
                gap-2
              "
            >
              <Link
                href="/login?callbackUrl=/pro/register"
                className="
                  flex
                  min-h-[44px]
                  items-center
                  justify-center
                  rounded-xl
                  bg-brand
                  px-2
                  text-center
                  text-[9px]
                  font-black
                  text-white
                "
              >
                Créer ma fiche pro
              </Link>

              <Link
                href="/pro/revendiquer"
                className="
                  flex
                  min-h-[44px]
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-brand
                  px-2
                  text-center
                  text-[9px]
                  font-black
                  text-brand
                "
              >
                Modifier ma fiche
              </Link>
            </div>
          </div>
        </Stage>

        </div>

        {/* ==================================================
            BANDE DE REASSURANCE
        =================================================== */}

        <section
          className="
            relative
            z-10
            border-t
            border-border/60
            bg-white/95
            px-4
            pt-5
            pb-0
            md:py-7
          "
        >
          <div
            className="
              grid
              grid-cols-4
              gap-2
            "
          >
            {[
              {
                icon: ShieldCheck,
                title: 'Réseau de confiance',
                text: 'Des pros vérifiés',
              },
              {
                icon: MapPin,
                title: 'Partout en France',
                text: 'Recherche locale',
              },
              {
                icon: Clock3,
                title: 'Gain de temps',
                text: 'Trouvez vite',
              },
              {
                icon: Heart,
                title: 'Passion moto',
                text: 'Par les motards',
              },
            ].map(item => {
              const Icon =
                item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    text-center
                  "
                >
                  <Icon
                    className="
                      mx-auto
                      h-5
                      w-5
                      text-brand
                    "
                  />

                  <strong
                    className="
                      mt-2
                      block
                      text-[6.5px]
                      leading-tight
                    "
                  >
                    {item.title}
                  </strong>

                  <span
                    className="
                      mt-1
                      block
                      text-[6px]
                      leading-tight
                      text-muted-foreground
                    "
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      </main>
    </>
  );
}