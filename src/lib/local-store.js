/**
 * Local demo store. Mirrors the Supabase table shapes so the app is fully
 * browsable (home, shop, product, cart, wishlist) before the backend env
 * vars exist. Kept in one place so the fallback stays honest and small.
 */

const H = (w = 800, q = 80) => `?w=${w}&q=${q}&auto=format&fit=crop`
const img = (id) => `https://images.unsplash.com/${id}${H()}`

export const categories = [
  { name: 'Phones', slug: 'phones', icon: 'smartphone', sort: 1 },
  { name: 'Audio', slug: 'audio', icon: 'headphones', sort: 2 },
  { name: 'Wearables', slug: 'wearables', icon: 'watch', sort: 3 },
  { name: 'Laptops', slug: 'laptops', icon: 'laptop', sort: 4 },
  { name: 'Accessories', slug: 'accessories', icon: 'cable', sort: 5 },
  { name: 'Smart Home', slug: 'smart-home', icon: 'home', sort: 6 },
]

export const deals = [
  {
    id: 'deal-1',
    title: 'Audio Week',
    subtitle: 'Headphones, earbuds and speakers from the names you trust.',
    discount_text: 'Up to 25% off',
    cta_label: 'Shop the drop',
    image_url: img('photo-1505740420928-5e560c06d30e'),
    accent: 'violet',
    category: 'audio',
    ends_at: new Date(Date.now() + 3 * 864e5).toISOString(),
  },
  {
    id: 'deal-2',
    title: 'Desk Upgrade Days',
    subtitle: 'Keyboards, monitors and docks to finish your setup.',
    discount_text: 'Save 15%',
    cta_label: 'Upgrade your desk',
    image_url: img('photo-1547394765-185e1e68f34e'),
    accent: 'cyan',
    category: 'accessories',
    ends_at: new Date(Date.now() + 6 * 864e5).toISOString(),
  },
]

const seed = [
  ['Aurora Buds Pro', 'aurora-buds-pro', 'Aurora', 'Flagship wireless earbuds with adaptive noise cancelling and 30 hour total battery.', 129, 99, 'audio', 4.7, 812, ['photo-1590658268037-6bf12165a8df', 'photo-1606220945770-b5b6c2c55bf1'], { battery: '30 hours with case', noise: 'Adaptive ANC', water: 'IPX4', weight: '5.2 g per bud' }, ['New'], true, 42, 57],
  ['Aurora Buds Lite', 'aurora-buds-lite', 'Aurora', 'Everyday wireless earbuds with fast pairing and punchy bass.', 59, 39, 'audio', 4.4, 1301, ['photo-1606220588913-b3aacb4d2f46'], { battery: '20 hours with case' }, [], false, 120, 23],
  ['Nimbus ANC Over-Ear', 'nimbus-anc-over-ear', 'Nimbus', 'Studio-grade over-ear headphones with hybrid noise cancelling.', 249, 199, 'audio', 4.8, 540, ['photo-1505740420928-5e560c06d30e', 'photo-1583394838336-acd977736f90'], { battery: '40 hours', noise: 'Hybrid ANC', weight: '248 g' }, ['Best seller'], false, 18, 41],
  ['Pulse Dot Speaker', 'pulse-dot-speaker', 'Pulse', 'Pocket smart speaker with room-filling sound and voice assistant.', 49, null, 'audio', 4.3, 2310, ['photo-1608043152269-423dbba4e7e1'], { power: '15 W', battery: '12 hours' }, [], false, 300, 88],
  ['Halo Watch Series 5', 'halo-watch-series-5', 'Halo', 'Fitness and sleep tracking with a bright always-on AMOLED display.', 199, 179, 'wearables', 4.6, 967, ['photo-1523275335684-37898b6baf30', 'photo-1508685096489-7aacd43bd3b1'], { battery: '6 days', water: '5 ATM' }, ['New'], false, 60, 35],
  ['Halo Band Mini', 'halo-band-mini', 'Halo', 'Slim activity band with two week battery life.', 79, null, 'wearables', 4.2, 3421, ['photo-1575311373937-040b8e1fd5b6'], { battery: '14 days' }, [], false, 210, 19],
  ['Titan Smartwatch Ultra', 'titan-smartwatch-ultra', 'Titan', 'Rugged GPS smartwatch with sapphire glass and dual-band positioning.', 499, null, 'wearables', 4.9, 274, ['photo-1434493789847-2f02dc6ca35d'], { battery: '36 hours GPS mode', case: 'Titanium', water: '10 ATM' }, ['Premium'], true, 12, 64],
  ['Nova X5 Smartphone', 'nova-x5-smartphone', 'Nova', '120 Hz OLED flagship killer with triple camera and 65 W charging.', 599, 549, 'phones', 4.7, 1523, ['photo-1511707171634-5f897ff02aa9', 'photo-1512941937669-90a1b58e7e9c'], { display: '6.7 inch OLED', battery: '5000 mAh, 65 W' }, ['-10%'], false, 75, 97],
  ['Nova X5 Lite', 'nova-x5-lite', 'Nova', 'Big battery, small price. A dependable daily driver.', 249, null, 'phones', 4.3, 2890, ['photo-1520923642038-b4259acecbd7'], { display: '6.5 inch 90 Hz', battery: '5500 mAh' }, [], false, 140, 30],
  ['Quasar Fold', 'quasar-fold', 'Quasar', 'Book-style folding phone with a creaseless inner display.', 1299, 1149, 'phones', 4.5, 189, ['photo-1614624532983-4ce03382d63d'], { display: '7.8 inch foldable', battery: '4800 mAh' }, ['-12%', 'Premium'], true, 7, 52],
  ['Zephyr Air Laptop 14', 'zephyr-air-laptop-14', 'Zephyr', 'Featherweight aluminum laptop with all day battery.', 999, null, 'laptops', 4.6, 612, ['photo-1496181133206-80ce9b88a853', 'photo-1517336714731-489689fd1ca8'], { ram: '16 GB', battery: '18 hours' }, [], false, 25, 43],
  ['Zephyr Pro 16 Creator', 'zephyr-pro-16-creator', 'Zephyr', 'Creator workstation with dedicated GPU and mini LED panel.', 2199, null, 'laptops', 4.8, 244, ['photo-1618424181497-157f25b6ddd5'], { gpu: '16 GB dedicated', ram: '32 GB' }, ['Premium'], false, 6, 27],
  ['Ember Mechanical Keyboard 75', 'ember-mechanical-keyboard-75', 'Ember', 'Hot-swappable 75 percent mechanical keyboard with gasket mount.', 119, 94, 'accessories', 4.7, 1755, ['photo-1595225476474-87563907a212', 'photo-1618384887929-16ec33fab9ef'], { switches: 'Hot-swappable linear', connection: 'USB-C, BT, 2.4G' }, ['-21%'], false, 85, 61],
  ['Ember Mouse Ultralight', 'ember-mouse-ultralight', 'Ember', '58 gram wireless gaming mouse with 4000 Hz polling.', 89, null, 'accessories', 4.6, 980, ['photo-1615663245857-ac93bb7c39e7'], { weight: '58 g', battery: '90 hours' }, [], false, 70, 22],
  ['Vertex 4K Monitor 27', 'vertex-4k-monitor-27', 'Vertex', '27 inch 4K IPS monitor with USB-C power delivery.', 449, 399, 'accessories', 4.5, 431, ['photo-1510519138101-570d1dca3d66'], { refresh: '144 Hz', ports: 'USB-C 96 W' }, ['-11%'], true, 30, 38],
  ['Switchboard 8-in-1 Hub', 'switchboard-8-in-1-hub', 'Switchboard', 'USB-C hub with dual 4K output, Ethernet and card readers.', 69, null, 'accessories', 4.4, 2109, ['photo-1558089687-f282ffcbc126'], { ports: '10 total' }, [], false, 180, 15],
  ['Vault 256 SSD', 'vault-256-ssd', 'Vault', 'Pocket sized NVMe drive with 1050 MB/s USB-C speeds.', 39, null, 'accessories', 4.5, 5400, ['photo-1620641788421-7a1c342ea42e'], { capacity: '256 GB' }, [], false, 400, 12],
  ['Shield Tablet 11', 'shield-tablet-11', 'Shield', '11 inch 120 Hz tablet with stylus support and quad speakers.', 379, 329, 'laptops', 4.4, 520, ['photo-1544244015-0df4b3ffc6b0'], { stylus: '4000 pressure levels' }, ['-13%'], false, 45, 26],
  ['Loop Charge Pad Duo', 'loop-charge-pad-duo', 'Loop', 'Two device Qi2 charging pad with active cooling.', 59, null, 'smart-home', 4.3, 1122, ['photo-1586953208448-b95a79798f07'], { standard: 'Qi2' }, [], false, 160, 18],
  ['Beacon Bulb Starter Kit', 'beacon-bulb-starter-kit', 'Beacon', 'Three smart bulbs with scenes, schedules and voice control.', 49, 42, 'smart-home', 4.2, 1876, ['photo-1529390304330-ee6c3d638802'], { bulbs: '3x E27' }, ['-14%'], false, 200, 21],
  ['Sentry Cam 2K Indoor', 'sentry-cam-2k-indoor', 'Sentry', '2K indoor security camera with local storage and night vision.', 79, null, 'smart-home', 4.5, 2044, ['photo-1589003077984-894e133dabab'], { night: 'Color night vision' }, ['Best seller'], false, 95, 44],
  ['Breeze Smart Purifier', 'breeze-smart-purifier', 'Breeze', 'HEPA purifier with air quality sensing and app scheduling.', 189, 159, 'smart-home', 4.6, 733, ['photo-1585771724684-38269d6639fd'], { coverage: '35 m2' }, ['-16%'], false, 28, 17],
  ['Lumen Projector Mini', 'lumen-projector-mini', 'Lumen', '1080p portable projector with built in streaming and stereo sound.', 299, null, 'smart-home', 4.4, 389, ['photo-1709528922659-8f86b0f02b9b'], { brightness: '600 ANSI lumens' }, [], true, 20, 33],
  ['Aurora Buds Sport', 'aurora-buds-sport', 'Aurora', 'Secure fit ear hooks, IP57 and 9 hour battery per charge.', 89, null, 'audio', 4.5, 654, ['photo-1484704849700-f032a568e944'], { water: 'IP57' }, [], false, 88, 25],
  ['Halo Ring Fitness Tracker', 'halo-ring-fitness-tracker', 'Halo', 'Smart ring with sleep staging and recovery scoring.', 249, null, 'wearables', 4.3, 156, ['photo-1550631392-26e6823af219'], { material: 'Titanium' }, ['New'], false, 40, 29],
  ['Nova Charge Puck', 'nova-charge-puck', 'Nova', 'Wireless charging puck sized to top up earbud cases on the go.', 29, null, 'accessories', 4.1, 764, ['photo-1609091839311-d5365f9ff1c5'], { output: '10 W' }, [], false, 260, 9],
  ['Zephyr Dock Thunder Slim', 'zephyr-dock-thunder-slim', 'Zephyr', 'Thunderbolt dock that drives two 4K monitors from one cable.', 249, 209, 'accessories', 4.7, 402, ['photo-1587829741301-dc798b83add3'], { video: '2x 4K60' }, ['-16%'], false, 35, 14],
  ['Quasar Flip Retro', 'quasar-flip-retro', 'Quasar', 'Clamshell flip phone with big buttons and a 30 day standby.', 99, null, 'phones', 4.0, 312, ['photo-1523206489230-c012c64b2b48'], { battery: '30 day standby' }, [], false, 55, 8],
  ['Sentry Video Doorbell Pro', 'sentry-video-doorbell-pro', 'Sentry', 'Wirefree doorbell with package detection and local AI.', 179, 149, 'smart-home', 4.6, 908, ['photo-1531700968341-bd114e5006ec'], { battery: '4 months' }, ['-17%'], false, 48, 37],
  ['Ember Desk Mat XL', 'ember-desk-mat-xl', 'Ember', 'Cork and leather desk mat that quiets the whole setup.', 39, null, 'accessories', 4.8, 2861, ['photo-1615800098779-1be32e60cca3'], { size: '900 x 400 mm' }, ['Best seller'], false, 220, 11],
]

export const localProducts = seed.map(([name, slug, brand, description, price, sale, category, rating, ratingCount, imgs, specs, badges, sponsored, stock, viewing], i) => ({
  id: `local-${i + 1}`,
  name,
  slug,
  brand,
  description,
  price,
  sale_price: sale,
  category,
  rating,
  rating_count: ratingCount,
  images: imgs.map(img),
  specs,
  badges,
  sponsored,
  stock,
  viewing,
}))

export async function localListProducts({ category, order = 'featured', search = '' } = {}) {
  let rows = [...localProducts]
  if (category) rows = rows.filter((p) => p.category === category)
  if (search) rows = rows.filter((p) => (p.name + ' ' + p.brand).toLowerCase().includes(search.toLowerCase()))
  if (order === 'price-asc') rows.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
  if (order === 'price-desc') rows.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
  if (order === 'rating') rows.sort((a, b) => b.rating - a.rating)
  return rows
}

export async function localGetDeal() {
  return deals[0]
}

export async function localGetDeals() {
  return deals
}
