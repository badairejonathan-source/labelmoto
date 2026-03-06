
const brandLogos: Record<string, string> = {
    'BMW': `<g transform='scale(1.5)'>
        <circle cx='0' cy='0' r='10' fill='#fff'/>
        <path d='M0,0 l0,-10 a10,10 0 0,1 0,20 l0,-10' fill='#000'/>
        <path d='M0,0 l-10,0 a10,10 0 0,1 20,0 l-10,0' fill='#4dabf7'/>
        <path d='M0,0 l-10,0 a10,10 0 0,0 10,10' fill='#4dabf7'/>
        <path d='M0,0 l0,-10 a10,10 0 0,0 -10,10' fill='#fff'/>
        <circle cx='0' cy='0' r='10' fill='none' stroke='#000' stroke-width='1.5'/>
        <circle cx='0' cy='0' r='7' fill='none' stroke='#000' stroke-width='0.5' opacity='0.5'/>
    </g>`,
    'Ducati': `<g transform='scale(1.2)'>
        <path d='M-12,-8 L12,-8 L12,8 L-12,8 Z' fill='#D40000'/>
        <path d='M-8,-4 L0,-4 L0,4 L-8,4 Z M -4,0 L8,0' fill='none' stroke='#fff' stroke-width='2'/>
    </g>`,
    'Yamaha': `<g transform='scale(1.5)'>
      <circle cx='0' cy='0' r='10' fill='#D40000'/>
      <g fill='none' stroke='#fff' stroke-width='1.2'>
        <path d='M-6,0 a2,2 0 1,0 12,0' transform='rotate(30)'/>
        <path d='M-6,0 a2,2 0 1,0 12,0' transform='rotate(150)'/>
        <path d='M-6,0 a2,2 0 1,0 12,0' transform='rotate(270)'/>
      </g>
    </g>`,
    'Kawasaki': `<g transform='scale(1.2)'>
        <path d='M0,-8 L2,-5 L-4,0 L2,5 L0,8 L-2,5 L-8,0 L-2,-5 Z' fill='#00A651'/>
        <text x='0' y='3' font-family='sans-serif' font-size='8' fill='#fff' text-anchor='middle' font-weight='bold'>K</text>
    </g>`,
    'KTM': `<g transform='scale(1.2)'>
        <path d='M-10,-6 L10,-6 L10,6 L-10,6 Z' fill='#FF6600'/>
        <text x='0' y='3' font-family='sans-serif' font-size='9' fill='#fff' text-anchor='middle' font-weight='bold'>KTM</text>
    </g>`,
    'Husqvarna': `<g transform='scale(1.5)'>
        <circle cx='0' cy='0' r='10' fill='#000'/>
        <path d='M0,-6 L2,-4 L0,8 L-2,-4 Z M 3,-2 L5,0 M -3,-2 L -5,0' fill='none' stroke='#fff' stroke-width='2'/>
    </g>`,
    'Honda': `<g transform='scale(1.4)'>
      <path d='M -8,-5 C -8,-8 8,-8 8,-5 C 8,0 4,4 0,8 C -4,4 -8,0 -8,-5' fill='#D40000'/>
      <path d='M -5,-4 C -5,-6 5,-6 5,-4 C 5,-1 3,2 0,5 C -3,2 -5,-1 -5,-4' fill='#fff'/>
    </g>`,
    'Suzuki': `<g transform='scale(1.4)'>
        <path d='M -2,8 L -5,8 C -10,8 -10,-2 0,-2 C 10,-2 10,8 5,8 L 2,8 L 2,6 L 5,6 C 8,6 8,-0 0,-0 C -8,0 -8,6 -5,6 L -2,6 Z' fill='#D40000'/>
    </g>`,
    'Triumph': `<g transform='scale(1.4)'>
      <circle cx='0' cy='0' r='10' fill='none' stroke='#000' stroke-width='1.5'/>
      <path d='M 0,-10 L 0,0 L -8,5 M 0,0 L 8,5' stroke='#000' stroke-width='1.5'/>
      <path d='M -10,0 A 10 10 0 0 1 10,0' fill='none' stroke='#000' stroke-width='1.5'/>
    </g>`,
    'Harley-Davidson': `<g transform='scale(1.2)'>
        <path d='M-12,-6 L12,-6 L12,6 L-12,6 Z' fill='#000'/>
        <path d='M-12,-6 L12,6 M -12,6 L 12,-6' stroke='#FF6600' stroke-width='1'/>
        <text x='0' y='2' font-family='sans-serif' font-size='6' fill='#fff' text-anchor='middle' font-weight='bold'>H-D</text>
    </g>`,
    'Indian': `<g transform='scale(1.2)'>
        <path d='M -10,6 L -6,-8 L 0,-2 L 6,-8 L 10,6 L 0,2 Z' fill='#A52A2A'/>
        <text x='0' y='-1' font-family='serif' font-size='7' fill='#fff' text-anchor='middle'>I</text>
    </g>`,
    'Royal Enfield': `<g transform='scale(1.2)'>
        <circle cx='0' cy='0' r='10' fill='#701c1c'/>
        <text x='0' y='3' font-family='serif' font-size='6' fill='#fff' text-anchor='middle' font-weight='bold'>RE</text>
    </g>`,
    'Moto Guzzi': `<g transform='scale(1.2)'>
        <circle cx='0' cy='0' r='10' fill='#212121'/>
        <text x='0' y='3' font-family='serif' font-size='5' fill='#fff' text-anchor='middle' font-weight='bold'>MG</text>
    </g>`,
    'Aprilia': `<g transform='scale(1.2)'>
        <rect x='-10' y='-6' width='20' height='12' fill='#e30613'/>
        <text x='0' y='3' font-family='sans-serif' font-size='7' fill='#fff' text-anchor='middle' font-weight='bold'>a</text>
    </g>`,
    'Benelli': `<g transform='scale(1.2)'>
        <circle cx='0' cy='0' r='10' fill='#005826'/>
        <text x='0' y='3' font-family='sans-serif' font-size='6' fill='#fff' text-anchor='middle' font-weight='bold'>B</text>
    </g>`,
    'Vespa': `<g transform='scale(1.2)'>
        <circle cx='0' cy='0' r='10' fill='#00adef'/>
        <text x='0' y='3' font-family='cursive' font-size='7' fill='#fff' text-anchor='middle' font-weight='bold'>V</text>
    </g>`,
    'Piaggio': `<g transform='scale(1.2)'>
        <rect x='-8' y='-8' width='16' height='16' rx='2' fill='#004a99'/>
        <path d='M -4,0 L 0,4 L 4,0' fill='none' stroke='#fff' stroke-width='2'/>
    </g>`,
    'CF Moto': `<g transform='scale(1.2)'>
        <circle cx='0' cy='0' r='10' fill='#009fe3'/>
        <text x='0' y='3' font-family='sans-serif' font-size='5' fill='#fff' text-anchor='middle' font-weight='bold'>CF</text>
    </g>`,
};

export default brandLogos;
