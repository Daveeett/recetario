import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'proybetza',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

interface SeedRecipe {
  title: string;
  category: string;
  difficulty: string;
  cook_time: string;
  description: string;
  image_url: string;
  ingredients: string[];
  steps: string[];
}

const RECIPES: SeedRecipe[] = [
  {
    title: 'Flan de Caramelo',
    image_url: 'https://www.elespectador.com/resizer/v2/KBNKUH6COBAZVMKEIBLIL7347M.jpg?auth=f2e5c6c28f68f758ea33bc26fe0f8e481d3dd5c9133a6c6becf34904cf994162&width=920&height=613&smart=true&quality=60',
    category: 'dulce', difficulty: 'facil', cook_time: '60 min',
    description: 'Clásico flan casero con caramelo líquido, suave y cremoso.',
    ingredients: ['6 huevos', '1 lata leche condensada', '1 lata leche evaporada', '1 taza azúcar', '1 cdita vainilla'],
    steps: [
      'Precalienta el horno a 175°C (350°F) y prepara un molde de vidrio o flanera de 22 cm.',
      'Prepara el caramelo: en una sartén a fuego medio-alto, derrite lentamente 1 taza de azúcar sin revolver. Cuando tome un color ámbar dorado, retira del fuego y vierte de inmediato en el molde, inclinándolo para cubrir toda la base. Cuidado: el caramelo está extremadamente caliente.',
      'Deja enfriar el caramelo en el molde por 5 minutos hasta que endurezca.',
      'En la licuadora, combina los 6 huevos, la lata de leche condensada, la lata de leche evaporada y la cucharadita de vainilla. Licua a velocidad media por 30 segundos hasta obtener una mezcla homogénea y sin grumos.',
      'Vierte la mezcla del flan sobre el caramelo endurecido en el molde, pasándola por un colador fino para eliminar las burbujas de aire.',
      'Coloca el molde dentro de una bandeja más grande y llena esa bandeja con agua caliente hasta la mitad del molde (baño María). Esto garantiza una cocción suave y uniforme.',
      'Hornea por 50-55 minutos. El flan estará listo cuando al insertar un cuchillo en el centro, salga limpio y la superficie se vea firme pero con un ligero temblor central.',
      'Retira del horno y del baño María. Deja enfriar completamente a temperatura ambiente (unos 30 min) y luego refrigera mínimo 4 horas, idealmente toda la noche.',
      'Para desmoldar: pasa un cuchillo fino por los bordes, coloca un plato grande encima y voltea con un movimiento firme. El caramelo líquido bañará el flan. Sirve frío.',
    ],
  },
  {
    title: 'Churros con Chocolate',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7bCfmHGAwyLi60OmWY10ekzCoWkXZUY4HtVB_nD8o34AFQ2n0VkPGIZU&s=10',
    category: 'dulce', difficulty: 'media', cook_time: '30 min',
    description: 'Churros crujientes bañados en azúcar con chocolate caliente.',
    ingredients: ['1 taza agua', '2 cdts azúcar', '1/2 taza mantequilla', '1 taza harina', '3 huevos', 'Aceite para freír', 'Chocolate para derretir'],
    steps: [
      'En una olla mediana, combina el agua, 2 cucharaditas de azúcar y la mantequilla. Lleva a ebullición a fuego medio-alto.',
      'Cuando hierva, retira del fuego y agrega la harina de una sola vez. Mezcla vigorosamente con una cuchara de madera hasta que la masa se separe de las paredes de la olla y forme una bola lisa.',
      'Deja enfriar la masa 5 minutos. Luego añade los huevos de uno en uno, mezclando muy bien tras cada adición. La masa estará lista cuando sea brillante y caiga del cucharón formando una "V".',
      'Calienta abundante aceite en una sartén honda a 180°C. Prueba con un trozo de masa: debe dorar en 60 segundos.',
      'Rellena una manga pastelera con boquilla estrellada (1 cm). Forma tiras de 12-15 cm directamente sobre el aceite. Corta con tijera.',
      'Fríe por 2-3 minutos por cada lado hasta que estén dorados y crujientes. No sobrecargues la sartén.',
      'Escurre sobre papel absorbente. Mezcla azúcar con canela molida y rueda los churros calientes en esta mezcla.',
      'Para el chocolate: derrite 150 g de chocolate oscuro a baño María, agrega 100 ml de crema líquida caliente y revuelve hasta obtener una salsa brillante. Sirve los churros calientes con el chocolate.',
    ],
  },
  {
    title: 'Arroz con Leche',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpqwp4fSAgCyGiJV3MMx1IKoO73R2ostlupTuHRguEa0Wr9W6ugv4n57rJ&s=10',
    category: 'dulce', difficulty: 'facil', cook_time: '40 min',
    description: 'Arroz con leche cremoso con canela y pasitas.',
    ingredients: ['1 taza arroz', '1 litro leche', '1 rama canela', '1/2 taza azúcar', '1 cdta vainilla', 'Pasitas'],
    steps: [
      'Enjuaga el arroz con agua fría hasta que el agua salga clara. Escurre bien.',
      'En una olla mediana, hierve 2 tazas de agua con la rama de canela. Agrega el arroz y cocina a fuego medio por 10 minutos, hasta que el agua se absorba casi completamente.',
      'Añade el litro de leche caliente poco a poco, revolviendo constantemente para evitar que se pegue.',
      'Cocina a fuego bajo por 20 minutos, revolviendo cada 2-3 minutos, hasta que el arroz esté muy suave y la mezcla espese a una consistencia cremosa.',
      'Agrega el azúcar, la vainilla y las pasitas. Revuelve y cocina 5 minutos más.',
      'Retira la rama de canela. Prueba y ajusta el dulzor.',
      'Sirve en copas o tazones individuales. Espolvorea canela molida por encima. Puede servirse caliente o refrigerado (se espesa más al enfriar).',
    ],
  },
  {
    title: 'Mazamorra Morada',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH4e4AAyfyyQF0b0hR1p4rv6LObBkhFJMypNo4Yd42BajvopChFgZDxUI&s=10',
    category: 'dulce', difficulty: 'media', cook_time: '45 min',
    description: 'Postre peruano de maíz morado con frutas.',
    ingredients: ['1 kg maíz morado', '2 litros agua', '1/2 taza azúcar', '3 manzanas', '1 taza piña', 'Canela y clavo', '1 cda maicena'],
    steps: [
      'Lava bien el maíz morado. En una olla grande, hierve los 2 litros de agua con el maíz, 1 raja de canela y 3 clavos de olor a fuego alto por 30 minutos hasta que el agua tome un color morado intenso.',
      'Cuela el líquido y reserva; descarta el maíz ya que solo se usa para dar color y sabor.',
      'Pela y corta las manzanas en cubos pequeños. Corta la piña en trozos similares.',
      'Vuelve a hervir el líquido morado. Añade el azúcar y revuelve hasta disolver. Agrega la fruta picada.',
      'Cocina a fuego medio por 15-20 minutos hasta que la fruta esté tierna pero no deshecha.',
      'Disuelve la maicena en 1/4 taza de agua fría. Vierte poco a poco en la mazamorra hirviendo mientras revuelves constantemente para evitar grumos.',
      'Cocina 5 minutos más hasta que espese a una consistencia similar al yogur. Retira del fuego.',
      'Vierte en vasitos o tazones individuales. Deja enfriar a temperatura ambiente y luego refrigera por al menos 2 horas. Sirve frío, opcionalmente con leche condensada por encima.',
    ],
  },
  {
    title: 'Dulce de Cajeta',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa4nqD0L2w0R6_fzM59SzJk2EB-s3VbY8DAMojlXwuVu0CUj6GTpXLVPQh&s=10',
    category: 'dulce', difficulty: 'media', cook_time: '90 min',
    description: 'Cajeta tradicional mexicana de leche de cabra.',
    ingredients: ['2 litros leche de cabra', '2 tazas azúcar', '1 rama canela', '1 cdta bicarbonato', '1 cdta vainilla'],
    steps: [
      'En una olla de fondo grueso, mezcla la leche de cabra con el azúcar y la rama de canela. Calienta a fuego medio revolviendo hasta que el azúcar se disuelva.',
      'Disuelve el bicarbonato en 1 cda de agua fría. Cuando la leche esté caliente (no hirviendo), agrega el bicarbonato; la mezcla espumará, revuelve hasta que baje la espuma.',
      'Sube el fuego a medio-alto y lleva a hervor. Reduce a fuego bajo-medio y cocina sin tapa por 60-80 minutos, revolviendo constantemente con una cuchara de madera, raspando el fondo para evitar que se pegue.',
      'La cajeta estará lista cuando tome un color ámbar dorado y al pasar la cuchara por el fondo, la línea permanezca visible por 2-3 segundos.',
      'Retira la canela. Fuera del fuego, agrega la vainilla y revuelve.',
      'Para verificar el punto: vierte unas gotas en un plato frío. Debe gelificar y no correr al inclinar el plato.',
      'Vierte en frascos esterilizados mientras está caliente. Tapa y voltea los frascos boca abajo 5 minutos para crear vacío. Guarda en refrigerador hasta 3 semanas.',
    ],
  },
  {
    title: 'Buñuelos de Viento',
    image_url: 'https://recetasdecocina.elmundo.es/wp-content/uploads/2016/02/receta-de-bunuelos.jpg',
    category: 'dulce', difficulty: 'dificil', cook_time: '45 min',
    description: 'Buñuelos esponjosos espolvoreados con azúcar glass.',
    ingredients: ['2 tazas harina', '1/2 taza azúcar', '4 huevos', '1 taza leche', '1 cdta royal', '1 cdta anís', 'Aceite'],
    steps: [
      'En un tazón grande, cierne la harina junto con el polvo para hornear (royal) y el anís. Esto airea la mezcla y elimina grumos.',
      'En otro recipiente, bate los huevos con el azúcar hasta obtener una mezcla pálida y espumosa (unos 3 minutos con batidora eléctrica).',
      'Agrega la leche a los huevos batidos y mezcla. Incorpora gradualmente la mezcla de harina, batiendo a velocidad baja hasta obtener una masa homogénea. No sobrebatas.',
      'Deja reposar la masa 15 minutos tapada con un trapo húmedo. Esto activa el polvo para hornear.',
      'Calienta abundante aceite en una sartén o cacerola a 170°C. Es importante no exceder la temperatura o los buñuelos dorarán afuera sin cocinarse adentro.',
      'Con dos cucharas, toma porciones de masa del tamaño de una nuez y suéltalas con cuidado en el aceite. Fríe en tandas pequeñas sin saturar la sartén.',
      'Cocina 3-4 minutos girándolos para que doren de manera uniforme. Estarán listos cuando floten y estén dorados por todos lados.',
      'Escurre en papel absorbente. Espolvorea generosamente con azúcar glass y sirve calientes. Son mejores recién hechos.',
    ],
  },
  {
    title: 'Cocadas',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLnQ-DPqg7I49M5hCDN-Ww2kKmfZiCMPCAh7lp4UVR9FPjL1lN335kpUw&s=10',
    category: 'dulce', difficulty: 'facil', cook_time: '30 min',
    description: 'Dulce de coco horneado, crujiente por fuera y suave por dentro.',
    ingredients: ['3 tazas coco rallado', '1 lata leche condensada', '3 yemas', '1 cdta vainilla'],
    steps: [
      'Precalienta el horno a 180°C y cubre una charola con papel encerado o silicón.',
      'En un tazón, mezcla el coco rallado, la leche condensada, las 3 yemas de huevo y la vainilla. Integra todo con una cuchara o con las manos limpias hasta que la mezcla sea uniforme.',
      'Deja reposar la mezcla 5 minutos para que el coco absorba los líquidos.',
      'Con una cuchara de helado o tus manos húmedas, forma bolitas del tamaño de una nuez. Compáctalas bien para que no se desmoronen al hornear.',
      'Coloca en la charola con espacio entre ellas (no se expanden mucho). Opcional: presiona ligeramente para forma de semiesfera.',
      'Hornea 18-20 minutos hasta que los bordes y la base estén dorados pero el centro aún se vea un poco pálido. Se endurecerán al enfriar.',
      'Deja enfriar completamente en la charola antes de despegar para que tomen consistencia. Guarda en recipiente hermético hasta 5 días.',
    ],
  },
  {
    title: 'Paella Valenciana',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEjqDK2-Rnd0uKuG2xhF9esTNYRUzWLfjqyLnpO5MUbV6xW-32HVhLyNmg&s=10',
    category: 'salada', difficulty: 'dificil', cook_time: '60 min',
    description: 'Paella clásica con mariscos, pollo y verduras.',
    ingredients: ['2 tazas arroz', '1 pollo troceado', '200 g camarones', '200 g mejillones', '1 pimiento rojo', '1 cebolla', 'Azafrán'],
    steps: [
      'Prepara el caldo de pollo casero o usa 1 litro de caldo de buena calidad. Mantén caliente. Disuelve el azafrán en 1/4 taza de caldo caliente y reserva.',
      'Sazona el pollo con sal, pimienta y pimentón. En la paellera con aceite de oliva bien caliente, dora el pollo a fuego alto hasta que esté bien sellado por todos lados (8-10 min). Reserva.',
      'En el mismo aceite, sofríe la cebolla finamente picada hasta que esté transparente. Agrega el pimiento rojo en tiras y sofríe 5 minutos más.',
      'Agrega ajo picado y sofríe 1 minuto. Añade jitomate rallado o picado y cocina hasta que se evapore el líquido y forme un sofrito concentrado (unos 8 min).',
      'Añade el arroz y tuéstalo 2 minutos removiéndolo constantemente hasta que los granos estén brillantes.',
      'Vierte el caldo caliente (doble del volumen del arroz), el azafrán disuelto y el pollo. Sube a fuego alto 5 minutos, luego reduce a fuego medio-bajo. NO REVUELVAS más.',
      'A los 10 minutos, distribuye los camarones y mejillones sobre el arroz. Continúa cocinando sin remover.',
      'Cuando el líquido se absorba casi por completo (15-18 min), sube el fuego 1-2 minutos para conseguir el "socarrat" (fondo crujiente). Cubre con papel aluminio y deja reposar 5 min. Sirve directo de la paellera con limón.',
    ],
  },
  {
    title: 'Tacos al Pastor',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEkJ9w9g2Kf8BINWOKUQ_W40eEnYzmWmdMMWfvXudO5g&s=10',
    category: 'salada', difficulty: 'media', cook_time: '40 min',
    description: 'Tacos adobados con piña y salsa verde.',
    ingredients: ['500 g cerdo', '2 chiles guajillo', '1/2 piña', '1 cebolla', 'Cilantro', 'Tortillas de maíz'],
    steps: [
      'Limpia los chiles guajillo: abre, quita semillas y venas. Tuesta ligeramente en comal seco 30 segundos por lado.',
      'Hidrata los chiles en agua caliente 15 minutos. Licúa con ajo, orégano, comino, vinagre, sal y un poco del agua de remojo hasta obtener un adobo liso.',
      'Corta el cerdo en bisteces delgados (1 cm). Mezcla con el adobo, asegurándote de que cada pieza quede bien impregnada. Marina mínimo 2 horas (idealmente toda la noche en refrigerador).',
      'Calienta el comal o sartén a fuego alto. Asa la carne marinada en tandas, sin moverla demasiado, para que se caramelice el adobo (3-4 min por lado). Pica en trozos pequeños.',
      'En el mismo comal, calienta la piña en rodajas hasta que caramelice y tome color dorado.',
      'Calienta las tortillas de maíz directamente en el comal hasta que estén calientes y maleables.',
      'Arma los tacos: tortilla + carne + piña picada + cebolla cruda finamente picada + cilantro. Acompaña con salsa verde y limón. El contraste dulce-salado es la clave.',
    ],
  },
  {
    title: 'Ensalada César',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHf52P9HPtm_6vsvrPGmOMo2aImjcxgQ8sEJyJ0HB2qA&s=10',
    category: 'salada', difficulty: 'facil', cook_time: '15 min',
    description: 'Ensalada clásica con pollo, crutones y aderezo cremoso.',
    ingredients: ['Lechuga romana', '2 pechugas pollo', '1 taza crutones', 'Queso parmesano', 'Aderezo César'],
    steps: [
      'Sazona las pechugas con sal, pimienta y un chorrito de aceite de oliva. Asa en sartén caliente o plancha 5-6 minutos por lado hasta que estén cocidas completamente. Deja reposar 5 minutos antes de cortar.',
      'Mientras reposa el pollo, prepara el aderezo casero: mezcla 2 cdas mayonesa, 1 cda mostaza Dijon, jugo de 1 limón, 1 diente de ajo rallado, sal y pimienta. Opcionalmente añade 1 cdta anchoa picada.',
      'Lava y seca bien las hojas de lechuga romana. Trocéalas con las manos en piezas de bocado. El secado es clave para que el aderezo se adhiera bien.',
      'Corta el pollo en tiras o cubos diagonales. Ralla generosamente el queso parmesano.',
      'En un tazón grande, mezcla la lechuga con el aderezo. Mezcla con suavidad para cubrir todas las hojas sin aplastarlas.',
      'Sirve en platos hondos. Agrega el pollo, los crutones (crujientes) y abundante parmesano rallado por encima. Sirve de inmediato para que los crutones no se ablanden.',
    ],
  },
  {
    title: 'Pozole Rojo',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_bFl4jiyxM6g9wnjgvFrg0CwG8SueRBhleV-MJGw7jA&s=10',
    category: 'salada', difficulty: 'dificil', cook_time: '120 min',
    description: 'Caldo tradicional de maíz con carne de cerdo y chiles rojos.',
    ingredients: ['500 g maíz pozolero', '500 g cerdo', '3 chiles guajillo', '1 cebolla', 'Orégano y lechuga'],
    steps: [
      'Si usas maíz seco, remójalo desde la noche anterior. Cocínalo en olla de presión con abundante agua por 45-60 minutos hasta que florezca (abra como flor). Si usas maíz enlatado precocido, solo enjuaga.',
      'En otra olla, cocina el cerdo (puede ser espinazo, pierna o lomo) cubierto de agua con 1/2 cebolla y sal por 45-60 minutos hasta que esté muy tierno. Deshebra la carne y reserva el caldo.',
      'Prepara el chile rojo: tuesta los chiles guajillo en comal seco 30 segundos. Hidrata en agua caliente 15 minutos. Licúa con ajo, comino y sal. Cuela.',
      'En una olla grande, sofríe la salsa de chile en 2 cdas de aceite caliente por 5 minutos hasta que cambie de color y perfume.',
      'Agrega el caldo de cerdo, el maíz pozolero y la carne deshebrada. Hierve a fuego medio por 20-30 minutos para que los sabores se integren. Ajusta sal.',
      'Para servir: llena tazones con el pozole y decora con lechuga rallada, orégano seco, cebolla cruda picada, rábanos en rodajas, tostadas y una buena cantidad de limón. El contraste de texturas es fundamental.',
    ],
  },
  {
    title: 'Empanadas de Pollo',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ53BWKdlDJ4f0Q9Rac6Jat7lhMNxI0SG3zDpXE9qWc0w&s=10',
    category: 'salada', difficulty: 'media', cook_time: '50 min',
    description: 'Empanadas horneadas rellenas de pollo y queso.',
    ingredients: ['2 tazas harina', '1/2 taza mantequilla', '1 pechuga pollo', '1 cebolla', '100 g queso'],
    steps: [
      'Masa: mezcla la harina con 1/2 cdta sal. Agrega la mantequilla fría en cubos y trabaja con los dedos hasta obtener una textura arenosa. Añade 1/4 taza agua fría de a poco hasta que la masa una. Refrigera 20 min.',
      'Relleno: cuece la pechuga con sal, ajo y laurel. Deshebra finamente. Sofríe la cebolla en aceite hasta transparente. Mezcla con el pollo y el queso rallado. Sazona con sal, pimienta y comino.',
      'Precalienta el horno a 200°C.',
      'Extiende la masa en una superficie enharinada a 3 mm de grosor. Corta círculos de 12 cm con un plato o cortador.',
      'Coloca 2 cdas de relleno en el centro de cada círculo. Dobla a la mitad formando una media luna. Sella los bordes presionando con un tenedor o haciendo un repulgue (dobleces decorativos).',
      'Coloca en charola enmantecada. Barniza con huevo batido para que doren. Pincha con tenedor para que salga el vapor.',
      'Hornea 20-25 minutos hasta que estén doradas y crujientes. Sirve calientes con salsa picante o guacamole.',
    ],
  },
  {
    title: 'Chiles Rellenos',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_UFku53IWfVqShDFqN9OP6M6tIddRD-xO3Rr-nFdGsw&s=10',
    category: 'salada', difficulty: 'dificil', cook_time: '60 min',
    description: 'Chiles poblanos rellenos de queso capeados en salsa.',
    ingredients: ['6 chiles poblanos', '300 g queso', '4 huevos', '1 taza salsa tomate', 'Aceite'],
    steps: [
      'Asa los chiles directamente en la flama del quemador de gas o en un comal a fuego alto, girándolos constantemente con pinzas hasta que la piel esté completamente negra y ampollada (5-7 min). Colócalos en una bolsa de plástico cerrada por 10 minutos para que se suden.',
      'Con guantes o bajo el chorro de agua fría, retira la piel quemada frotando suavemente. Haz un corte lateral y retira las semillas y venas con cuidado de no romper el chile.',
      'Rellena cada chile con abundante queso Oaxaca o queso panela en tiras. Cierra con palillos para que no se abra al freír.',
      'Capear: separa las claras de las yemas. Bate las claras a punto de nieve firme. Agrega las yemas una a una sin dejar de batir. Sazona con pizca de sal.',
      'Calienta aceite abundante en sartén a 175°C. Pasa cada chile relleno por harina y luego por el capeado de huevo.',
      'Fríe 2-3 chiles a la vez, bañando con aceite caliente encima. Gira cuidadosamente cuando el fondo esté dorado. Total: 4-5 minutos.',
      'Sirve sobre salsa de tomate caliente (jitomate licuado sofrito con ajo y cebolla). Acompaña con arroz rojo.',
    ],
  },
  {
    title: 'Caldo de Res',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRTviqmxtKm248PxQiujwdW4BxLO4FpJReyajUrVk9jw&s=10',
    category: 'salada', difficulty: 'facil', cook_time: '90 min',
    description: 'Caldo reconfortante de res con verduras y hierbas.',
    ingredients: ['500 g res', '2 elotes', '2 zanahorias', '1 calabacín', '1 papa', 'Cilantro'],
    steps: [
      'Limpia la carne de res (chambarete, osobuco o espinazo). Coloca en olla grande con 2 litros de agua fría. Lleva a hervor a fuego alto.',
      'Cuando hierva, retira la espuma gris que sube a la superficie con una cuchara. Esto garantiza un caldo limpio y transparente.',
      'Agrega 1/2 cebolla, 3 dientes de ajo, sal y pimienta en grano. Reduce a fuego medio y cocina tapado 50-60 minutos hasta que la carne esté muy tierna.',
      'Mientras tanto, pela y corta en trozos grandes la zanahoria, papa, y calabacín. Parte los elotes en rodajas de 4 cm.',
      'Agrega las verduras más duras primero: zanahoria, papa y elote. Cocina 20 minutos.',
      'Agrega el calabacín y cocina 10 minutos más. Prueba el caldo y ajusta sal.',
      'Sirve en tazones generosos con la carne y las verduras. Agrega cilantro fresco picado, cebolla cruda y un buen chorro de limón. Acompaña con tortillas calientes.',
    ],
  },
  {
    title: 'Pollo Agridulce',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlzyN5rW3L52jQBjUfUvLGgk8GcLuXh1bIXdWXgLgheQ&s=10',
    category: 'agridulce', difficulty: 'media', cook_time: '35 min',
    description: 'Pollo crujiente bañado en salsa agridulce de piña.',
    ingredients: ['500 g pechuga pollo', '1 taza harina maíz', '1/2 taza salsa tomate', '1/4 taza vinagre', '1/4 taza azúcar', '1/2 piña'],
    steps: [
      'Corta las pechugas en cubos de 3 cm. Sazona con sal, pimienta y ajo en polvo.',
      'En un tazón, mezcla la harina de maíz con una pizca de sal. Pasa los cubos de pollo por la harina y sacude el exceso. Para mayor crujiente, humedece el pollo en agua con sal, pásalo por harina, en huevo batido, y de nuevo en harina.',
      'Calienta aceite en sartén o wok a fuego alto. Fríe el pollo en tandas sin saturar la sartén, 4-5 minutos hasta que esté dorado y crujiente. Reserva sobre papel absorbente.',
      'Prepara la salsa: en el mismo wok limpio, sofríe ajo picado. Agrega salsa de tomate, vinagre de manzana, azúcar morena y una pizca de jengibre. Mezcla y cocina 3 minutos a fuego medio.',
      'Corta la piña en trozos y agrégala a la salsa. Cocina 3 minutos más. Si la salsa queda muy líquida, disuelve 1 cdta de maicena en agua y agrega.',
      'Añade el pollo crujiente a la salsa y saltea 1-2 minutos máximo para que no se ablande. El pollo debe seguir crujiente.',
      'Sirve de inmediato sobre arroz blanco o fideo. El contraste crujiente-agridulce es el corazón del plato.',
    ],
  },
  {
    title: 'Costillas BBQ Glaseadas',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRko34n7y12HyPAeJdoO0Tu0cz508kAW-3DWetfyK-DLQ&s=10',
    category: 'agridulce', difficulty: 'dificil', cook_time: '120 min',
    description: 'Costillas de cerdo con glaseado BBQ agridulce.',
    ingredients: ['1 kg costillas cerdo', '1 taza salsa BBQ', '2 cdas miel', '1 cda mostaza', '1 diente ajo'],
    steps: [
      'Retira la membrana de la parte posterior de las costillas jalándola con un trapo para mejor agarre. Esta membrana impide que los sabores penetren.',
      'Mezcla tu rub seco: paprika, ajo en polvo, cebolla en polvo, sal, pimienta negra y azúcar morena. Frota generosamente por todas las costillas. Refrigera mínimo 1 hora (o toda la noche).',
      'Precalienta el horno a 150°C (calor muy bajo y constante).',
      'Envuelve las costillas en papel aluminio doble, formando un paquete hermético. Hornea 90 minutos a baja temperatura. Esta cocción lenta hace que la carne se vuelva extraordinariamente tierna.',
      'Prepara el glaseado: en una cacerola, mezcla la salsa BBQ, la miel, la mostaza y el ajo rallado. Calienta a fuego bajo 5 minutos revolviendo. Prueba y ajusta dulzor/acidez.',
      'Saca las costillas del horno, abre el papel aluminio con cuidado del vapor. Sube la temperatura del horno a 200°C o enciende el grill.',
      'Baña generosamente las costillas con el glaseado. Hornea destapadas 15-20 minutos, bañando con más glaseado cada 5 minutos, hasta que estén caramelizadas y brillantes. Deja reposar 5 min antes de cortar.',
    ],
  },
  {
    title: 'Cerdo Agridulce con Piña',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9e3My1mOGZ41V7wocM91VM4Im9Gi3jZYBN4XhsJV4PQ&s=10',
    category: 'agridulce', difficulty: 'media', cook_time: '40 min',
    description: 'Lomo de cerdo salteado con piña y salsa de soya.',
    ingredients: ['500 g lomo cerdo', '1 taza piña', '3 cdas soya', '2 cdas vinagre', '2 cdas azúcar', '1 pimiento'],
    steps: [
      'Corta el lomo en tiras delgadas (1 cm) contra la fibra. Sazona con sal, pimienta y una pizca de jengibre en polvo.',
      'Prepara la salsa antes de cocinar: mezcla soya, vinagre de arroz, azúcar morena, 1 cda maicena y 2 cdas agua. Reserva.',
      'Calienta un wok o sartén grande a fuego muy alto con 2 cdas aceite. El wok debe estar muy caliente antes de añadir el cerdo.',
      'Saltea el cerdo en tandas pequeñas (no lo amontones o se cocerá al vapor en lugar de sellarse). 3-4 min hasta dorado. Reserva.',
      'En el mismo wok, saltea el pimiento rojo en juliana 2 min. Agrega la piña y saltea 1 min más.',
      'Vierte la salsa preparada sobre las verduras. Lleva a hervor y cocina 2 minutos hasta que espese y brille.',
      'Regresa el cerdo al wok y saltea todo junto 1 minuto para que se impregne. Sirve de inmediato sobre arroz jazmín. Decora con ajonjolí y cebollín.',
    ],
  },
  {
    title: 'Alitas Agridulces',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMdaAzR7_p_pzYv1d-n79yil5TsujGz6cBtXs3Kdw9uQ&s=10',
    category: 'agridulce', difficulty: 'facil', cook_time: '45 min',
    description: 'Alitas horneadas bañadas en salsa dulce y picante.',
    ingredients: ['1 kg alitas pollo', '1/2 taza miel', '1/4 taza soya', '1/4 taza salsa picante', '2 dientes ajo'],
    steps: [
      'Seca las alitas con papel absorbente. El exceso de humedad impide que queden crujientes. Si puedes, déjalas descubiertas en el refrigerador 1 hora.',
      'Mezcla la miel, salsa de soya, salsa picante (tipo Valentina o Cholula), ajo rallado y jugo de limón. Prueba el equilibrio dulce-picante.',
      'Marina las alitas en 2/3 de la salsa por mínimo 1 hora en bolsa zip o recipiente tapado. Reserva el resto de la salsa.',
      'Precalienta el horno a 200°C. Coloca las alitas en rejilla sobre una bandeja (esto permite que el aire circule y queden crujientes por todos lados).',
      'Hornea 25 minutos. Voltea las alitas y hornea 15 minutos más hasta que estén crujientes y doradas.',
      'Saca del horno y baña con la salsa reservada. Regresa al horno o pon el grill 5 minutos más para caramelizar el glaseado.',
      'Sirve calientes con semillas de ajonjolí, cebollín picado y ramas de apio. El contraste picante-dulce-crujiente es irresistible.',
    ],
  },
  {
    title: 'Berenjena Agridulce',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWuuVq16NUsIDrO8z3Sned36Il5t74lTdiz3RyzWzdaw&s=10',
    category: 'agridulce', difficulty: 'facil', cook_time: '25 min',
    description: 'Berenjenas salteadas con salsa agridulce de jengibre.',
    ingredients: ['2 berenjenas', '3 cdas soya', '2 cdas vinagre arroz', '1 cda azúcar', '1 cdta jengibre', 'Ajonjolí'],
    steps: [
      'Corta las berenjenas en medias lunas de 1.5 cm. Espolvorea con sal y deja reposar 20 minutos. Enjuaga y seca bien. Este paso extrae el amargor.',
      'Prepara la salsa: mezcla soya, vinagre de arroz, azúcar, jengibre fresco rallado y 1 cdta aceite de sésamo. Reserva.',
      'Calienta sartén grande a fuego alto con 2 cdas aceite vegetal. Cuando humee, añade las berenjenas en una sola capa. No las muevas por 3 minutos hasta que se doren.',
      'Voltea y dora el otro lado 2-3 minutos. Las berenjenas deben estar doradas y suaves pero no deshacerse.',
      'Reduce el fuego a medio. Vierte la salsa sobre las berenjenas. Cocina 2-3 minutos hasta que la salsa espese y cubra las berenjenas.',
      'Sirve en plato plano. Espolvorea ajonjolí tostado y cebollín. Ideal como guarnición o sobre arroz blanco.',
    ],
  },
  {
    title: 'Salmón Glaseado Miel Mostaza',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXfgxEQzmwhp1eEtVIwsxUjMuftt0L18gyNK17IDDQrA&s=10',
    category: 'agridulce', difficulty: 'facil', cook_time: '20 min',
    description: 'Salmón horneado con glaseado agridulce de miel y mostaza.',
    ingredients: ['4 filetes salmón', '2 cdas miel', '2 cdas mostaza', 'Aceite oliva', 'Limón'],
    steps: [
      'Saca el salmón del refrigerador 15 minutos antes. Seca con papel absorbente y sazona con sal y pimienta por ambos lados.',
      'Prepara el glaseado: mezcla miel, mostaza Dijon, 1 cda aceite de oliva, jugo de 1/2 limón y una pizca de romero seco. Prueba y ajusta dulzor.',
      'Precalienta el horno a 200°C con la rejilla en posición media-alta. Forra una bandeja con papel aluminio.',
      'Coloca los filetes con la piel hacia abajo en la bandeja. Distribuye generosamente el glaseado sobre la superficie del salmón.',
      'Hornea 12-15 minutos según el grosor (2.5 cm = 13 min aprox.). El salmón está listo cuando cambia de color a rosado opaco en el exterior pero el centro aún tiene un tono más translúcido. No sobre-cocines.',
      'Opcional: activa el grill los últimos 2 minutos para caramelizar el glaseado.',
      'Sirve inmediatamente con rodajas de limón. Acompaña con espárragos asados o arroz con hierbas. El pescado no debe esperar.',
    ],
  },
  {
    title: 'Tiramisú Clásico',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNP7z_zoJzohCiw3ZGXZy3DU9fNsyMy-wq9JWe0PxXQw&s=10',
    category: 'postre', difficulty: 'media', cook_time: '30min+refrig',
    description: 'Postre italiano cremoso de café con mascarpone y cacao.',
    ingredients: ['500 g mascarpone', '4 huevos', '1 taza azúcar', '200 g bizcotelas', '1 taza café fuerte', 'Cacao en polvo'],
    steps: [
      'Prepara un café espresso muy fuerte y deja enfriar completamente. Opcional: agrega 2 cdas de ron o amaretto.',
      'Separa las yemas de las claras. Bate las yemas con el azúcar con batidora eléctrica hasta obtener una mezcla pálida, espesa y que haya duplicado su volumen (efecto "punto de cinta": cae del batidor formando una cinta que tarda en desaparecer).',
      'Agrega el mascarpone a las yemas batidas e integra suavemente con espátula en movimientos envolventes, de abajo hacia arriba. No pierdas el aire incorporado.',
      'En otro tazón perfectamente limpio y seco, bate las claras a punto de nieve firme con una pizca de sal. Incorpora las claras al mascarpone en 3 tandas, siempre con movimientos envolventes suaves.',
      'Sumerge las bizcotelas brevemente (1-2 segundos por lado) en el café frío. No las remojes demasiado o se desintegrarán.',
      'En un molde rectangular, forma una primera capa de bizcotelas. Cubre con la mitad de la crema de mascarpone. Repite: segunda capa de bizcotelas + crema restante.',
      'Alisa la superficie. Cubre con film transparente y refrigera mínimo 4 horas (óptimo: toda la noche). Antes de servir, cierne cacao en polvo generosamente por encima.',
    ],
  },
  {
    title: 'Cheesecake Frutos Rojos',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjAbUiHlRE9RCSrmskDnP5M3zOrme8QIVk64c5rnMjnA&s=10',
    category: 'postre', difficulty: 'media', cook_time: '60min+refrig',
    description: 'Cheesecake clásico con coulis de frutos rojos.',
    ingredients: ['200 g galletas', '100 g mantequilla', '600 g queso crema', '1 taza azúcar', '3 huevos', '1 taza frutos rojos'],
    steps: [
      'Precalienta el horno a 160°C. Forra la base de un molde desmontable (22 cm) con papel encerado.',
      'Tritura las galletas hasta hacerlas polvo (procesador o bolsa + rodillo). Mezcla con la mantequilla derretida hasta obtener una textura de arena húmeda. Prensa firmemente en la base del molde. Refrigera 15 min.',
      'Bate el queso crema a temperatura ambiente (no frío) con el azúcar hasta que esté completamente liso, sin grumos. Este paso es crítico para la textura final.',
      'Agrega los huevos uno a uno a velocidad baja, sin sobre-batir. El exceso de aire produce grietas en la superficie al hornear.',
      'Añade 1 cdta de vainilla y 2 cdas de crema ácida. Mezcla suavemente. Vierte sobre la base de galletas.',
      'Hornea en baño María: coloca el molde dentro de una bandeja con 3 cm de agua caliente. Hornea 55-65 minutos. El cheesecake estará listo cuando los bordes estén firmes y el centro tiemble ligeramente al mover el molde.',
      'Apaga el horno, entreabre la puerta y deja el cheesecake dentro 1 hora más (el enfriamiento gradual evita grietas). Refrigera mínimo 4 horas. Cubre con coulis: cocina frutos rojos con azúcar 10 min y licúa.',
    ],
  },
  {
    title: 'Mousse de Chocolate Amargo',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8skNd7_IuCBD967fT44JHvimmL1inCL3jJlhk0i_n2A&s=10',
    category: 'postre', difficulty: 'facil', cook_time: '20min+refrig',
    description: 'Mousse ligero de chocolate oscuro con un toque de café.',
    ingredients: ['200 g chocolate amargo', '3 huevos', '1/2 taza azúcar', '1 taza crema batir', '1 cdta café'],
    steps: [
      'Derrite el chocolate amargo a baño María: coloca en tazón sobre agua apenas humeante (no hirviendo). Revuelve hasta que esté completamente liso. Retira del calor y deja enfriar a temperatura ambiente.',
      'Separa las yemas de las claras. Bate las yemas con el azúcar y la cucharadita de café soluble hasta que la mezcla sea pálida y espesa. Incorpora el chocolate derretido (ya templado) a las yemas.',
      'Bate la crema para batir a picos suaves (no rígidos). Incorpora a la mezcla de chocolate en 2 tandas con movimientos envolventes.',
      'En un tazón limpio y seco, bate las claras a punto de nieve firme. Incorpora al mousse en 3 tandas, con espátula y movimientos envolventes suaves para conservar el aire.',
      'Distribuye en copas o tazones individuales. No llenes de más: el mousse tiene mucho volumen.',
      'Cubre con film y refrigera mínimo 3 horas. Antes de servir, decora con virutas de chocolate, cacao en polvo o frutos rojos frescos.',
    ],
  },
  {
    title: 'Pastel de Tres Leches',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3HmbkwS2rH_vah3XhUXKQm6NCovypZRr7K7Qb48BjlA&s=10',
    category: 'postre', difficulty: 'media', cook_time: '45min+refrig',
    description: 'Pastel esponjoso bañado en tres tipos de leche.',
    ingredients: ['1 taza harina', '4 huevos', '1 taza azúcar', '1 lata leche condensada', '1 lata evaporada', '1 taza crema leche'],
    steps: [
      'Precalienta el horno a 180°C. Engrasa y enharina un molde rectangular de 23x33 cm.',
      'Bate los 4 huevos con el azúcar a máxima velocidad hasta obtener el punto de letra: la mezcla debe triplicar su volumen, ser muy pálida y al levantar el batidor, la mezcla debe caer formando cintas que tarden 5 segundos en desaparecer.',
      'Cierne la harina sobre la mezcla de huevos. Incorpora en 3 tandas con espátula y movimientos envolventes circulares de abajo hacia arriba. Nunca mezcles en círculos o perderás todo el aire.',
      'Vierte la mezcla en el molde. Hornea 25-30 minutos hasta que al insertar un palillo salga limpio y la superficie rebote al presionarla.',
      'Mientras el bizcocho se hornea, mezcla las tres leches: leche condensada + leche evaporada + crema de leche. Revuelve bien.',
      'Saca el pastel caliente. Con un palillo o tenedor, perfora abundantemente toda la superficie (esto es clave). Vierte las tres leches de manera uniforme. Dejará que el pastel absorba todo el líquido mientras enfría.',
      'Refrigera mínimo 3 horas. Decora con crema batida y fresas. El pastel debe estar completamente empapado y jugoso. Sirve frío.',
    ],
  },
  {
    title: 'Crème Brûlée',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuvnEzuh5gmmk4vMSHtyWVkuBHim4V60NemVkQ6MK23Q&s=10',
    category: 'postre', difficulty: 'media', cook_time: '60min+refrig',
    description: 'Natilla cremosa francesa con capa de caramelo crujiente.',
    ingredients: ['4 yemas', '1 taza crema', '1/2 taza azúcar', '1 vaina vainilla'],
    steps: [
      'Precalienta el horno a 150°C. Prepara 4 ramekins individuales.',
      'Abre la vaina de vainilla longitudinalmente y raspa las semillas. Calienta la crema con la vaina y las semillas a fuego bajo hasta que aparezcan pequeñas burbujas en los bordes (no hervir). Retira y deja infusionar 15 minutos.',
      'Bate las yemas con 1/4 taza azúcar hasta que la mezcla sea pálida y espesa. Añade lentamente la crema caliente al batir (temperado: añadir líquido caliente poco a poco para no cocer las yemas).',
      'Cuela la mezcla a través de un colador fino para eliminar la vaina y las impurezas. Elimina las burbujas de la superficie con una cuchara.',
      'Distribuye en los ramekins. Coloca en una bandeja con agua caliente (baño María). El agua debe llegar a 2/3 de altura de los ramekins.',
      'Hornea 35-40 minutos. Las natillas deben temblar ligeramente en el centro al mover la bandeja, como gelatina. Si están líquidas, necesitan más tiempo.',
      'Enfría a temperatura ambiente y refrigera al menos 4 horas. Al servir: cubre con 1 cdta azúcar fina y carameliza con un soplete de cocina en movimientos circulares hasta obtener una capa dura y ámbar. Sirve inmediatamente.',
    ],
  },
  {
    title: 'Volcán de Chocolate',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh8Or1tM7xsSfuajYsZg1dTxLFFjb9HAz7WI2dHeOtaQ&s=10',
    category: 'postre', difficulty: 'dificil', cook_time: '20 min',
    description: 'Bizcocho de chocolate con centro fundente.',
    ingredients: ['200 g chocolate', '100 g mantequilla', '2 huevos', '1/4 taza azúcar', '2 cdas harina'],
    steps: [
      'Engrasa y enharina 4 ramekins individuales con cuidado. Refrigéralos hasta usar. Este paso es crítico para desmoldar sin romperse.',
      'Derrite el chocolate y la mantequilla juntos a baño María o microondas en intervalos de 30 segundos, revolviendo entre cada uno. Deja enfriar a temperatura ambiente (no caliente o cocerá los huevos).',
      'Bate los huevos enteros con las yemas adicionales (si las usas) y el azúcar con batidora o globo hasta que estén bien integrados. No necesitas montar, solo mezclar bien.',
      'Integra la mezcla de huevos al chocolate derretido con espátula. Añade las 2 cdas de harina cernida y mezcla solo hasta que desaparezca. No sobre-mezcles.',
      'Vierte la mezcla en los ramekins preparados llenando solo hasta 3/4 de capacidad. Puedes refrigerar hasta 24 horas en este punto (hornea directamente del refrigerador sumando 2 min).',
      'Precalienta el horno a 220°C. Hornea exactamente 10-12 minutos. El exterior debe verse firme pero al presionar suavemente el centro debe sentirse líquido. El tiempo exacto depende de tu horno — haz una prueba con un ramekin.',
      'Deja reposar 30 segundos. Pasa un cuchillo por los bordes y voltea sobre el plato. Sirve de inmediato con helado de vainilla. El volcán debe fluir al cortarlo.',
    ],
  },
  {
    title: 'Panna Cotta con Frutos Rojos',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFl_kwkBChca2d9oyLkDZOPCLY6zyJEdt4cMMCwkdgnA&s=10',
    category: 'postre', difficulty: 'facil', cook_time: '20min+refrig',
    description: 'Cremoso postre italiano con coulis de frutos del bosque.',
    ingredients: ['2 tazas crema leche', '1/2 taza azúcar', '1 cdta vainilla', '2 hojas gelatina', '1 taza frutos rojos'],
    steps: [
      'Hidrata las hojas de gelatina en agua fría durante 5 minutos hasta que se suavicen completamente. Si usas gelatina en polvo: disuelve 7 g en 3 cdas agua fría.',
      'En una cacerola, calienta la crema con el azúcar a fuego medio. Revuelve hasta disolver el azúcar. No dejes que hierva.',
      'Retira del fuego. Escurre las hojas de gelatina y agrégalas a la crema caliente. Revuelve hasta que se disuelvan completamente. Agrega la vainilla.',
      'Vierte en moldes o vasitos individuales previamente humedecidos con agua fría (facilita el desmolde). Deja enfriar 20 minutos y refrigera al menos 4 horas.',
      'Prepara el coulis: en una cacerola pequeña, cocina los frutos rojos con 2 cdas azúcar y jugo de 1/2 limón por 8-10 minutos hasta que estén muy suaves. Licúa y cuela para obtener una salsa fina.',
      'Para desmoldar: pasa el molde por agua caliente 5 segundos y voltea sobre el plato. Si usas vasitos, sirve directamente.',
      'Vierte el coulis de frutos rojos sobre la panna cotta. Decora con frutos frescos y menta. La textura debe ser sedosa y temblar ligeramente al mover el plato.',
    ],
  },
  {
    title: 'Horchata de Arroz',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh3MormIMjSUcKRxf3LOUnVACQPgR_wFaVOn38zvjCpw&s=10',
    category: 'bebida', difficulty: 'facil', cook_time: '15min+refrig',
    description: 'Bebida tradicional refrescante de arroz con canela.',
    ingredients: ['1 taza arroz', '1 litro leche', '1 rama canela', '1/2 taza azúcar', '1 cdta vainilla'],
    steps: [
      'Enjuaga el arroz con agua fría. Colócalo en un tazón grande con 2 tazas de agua y la rama de canela. Deja remojar toda la noche (mínimo 8 horas). El remojo ablanda el arroz y facilita el licuado.',
      'Al día siguiente, licúa el arroz con el agua de remojo (sin tirar el agua) y la canela hasta obtener una mezcla muy fina. Licúa por 2-3 minutos a velocidad alta.',
      'Cuela la mezcla a través de un colador cubierto con manta de cielo o una tela fina. Presiona con una cuchara para extraer todo el líquido. Descarta el bagazo.',
      'Agrega el litro de leche fría al líquido colado. Añade el azúcar y la vainilla. Mezcla bien hasta que el azúcar se disuelva.',
      'Prueba y ajusta el dulzor. Para horchata más ligera, agrega agua simple. Para más cremosa, usa leche entera.',
      'Refrigera al menos 2 horas. La horchata tiende a separarse, agita bien antes de servir. Sirve en vasos altos sobre abundante hielo. Espolvorea canela molida por encima.',
    ],
  },
  {
    title: 'Margarita Clásica',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBwKh5UszldLkRK8JH1oZOF-DD_QIOBHR__wCpboJcLA&s=10',
    category: 'bebida', difficulty: 'facil', cook_time: '5 min',
    description: 'Margarita clásica de tequila con limón y sal.',
    ingredients: ['2 oz tequila', '1 oz limón', '1 oz Cointreau', 'Hielo', 'Sal'],
    steps: [
      'Prepara el vaso: frota un trozo de limón por el borde exterior del vaso. Inclina el vaso y hazlo girar sobre un plato con sal gruesa para escarcharlo. No pongas sal en el interior del vaso.',
      'En una coctelera, combina el tequila blanco (reposado para más sabor), el jugo de limón recién exprimido y el Cointreau (o triple sec).',
      'Agrega abundante hielo a la coctelera. Tapa firmemente y agita vigorosamente por 15-20 segundos hasta que la coctelera esté muy fría y las manos se entuman. El frío intenso es esencial para una buena margarita.',
      'Coloca hielo fresco en el vaso escarchado. Cuela y sirve la mezcla sobre el hielo. Si prefieres frozen: licúa todos los ingredientes con hielo.',
      'Decora con una rodaja de limón en el borde del vaso. La margarita perfecta tiene el balance ideal entre ácido (limón), dulce (Cointreau) y el alma del tequila.',
    ],
  },
  {
    title: 'Smoothie Mango y Maracuyá',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvnjhy0OHycGCktqkG-Bpkd8eFa31Vd_vt0MF2B2PO5Q&s=10',
    category: 'bebida', difficulty: 'facil', cook_time: '5 min',
    description: 'Smoothie tropical y cremoso de mango con maracuyá.',
    ingredients: ['2 mangos', '1 maracuyá', '1 taza leche', '1/2 taza hielo', '1 cda miel'],
    steps: [
      'Pela los mangos y corta la pulpa en cubos. Para un smoothie más frío y cremoso, usa mango congelado.',
      'Corta el maracuyá por la mitad y extrae la pulpa con cuchara. El maracuyá aporta acidez tropical que equilibra el dulzor del mango.',
      'En la licuadora, combina la pulpa de mango, el maracuyá, la leche, el hielo y la miel. Para versión vegana, usa leche de coco o almendras.',
      'Licúa a alta velocidad por 1-2 minutos hasta obtener una mezcla completamente suave y sin grumos de hielo.',
      'Prueba y ajusta: si está muy ácido, agrega más miel; si está muy dulce, exprime un poco de limón.',
      'Sirve inmediatamente en vasos altos. Decora con rodaja de mango y hierbabuena. Los smoothies pierden sus propiedades con el tiempo, bébelo de inmediato.',
    ],
  },
  {
    title: 'Agua de Jamaica',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaykpwJlItbddXlqMyXIRKXQnPCxBYbOAPbXw9-YTwqw&s=10',
    category: 'bebida', difficulty: 'facil', cook_time: '10min+enfriado',
    description: 'Agua fresca y floral de flor de jamaica.',
    ingredients: ['1 taza flores jamaica', '1 litro agua', '1/2 taza azúcar', 'Hielo'],
    steps: [
      'Enjuaga las flores de jamaica con agua fría para eliminar polvo e impurezas.',
      'En una olla, hierve el litro de agua. Cuando alcance el hervor pleno, agrega las flores de jamaica y baja el fuego.',
      'Cocina a fuego bajo por 10 minutos. El agua tomará un color rojo intenso y aroma floral. A más tiempo de cocción, más concentrado e intenso el sabor.',
      'Cuela y descarta las flores. Agrega el azúcar al líquido caliente y revuelve hasta disolver completamente.',
      'Agrega agua fría o hielo para llevar a 1.5-2 litros según el nivel de concentración deseado.',
      'Prueba y ajusta el dulzor. El agua de jamaica debe tener un perfecto balance entre ácido y dulce. Puedes añadir jugo de limón para potenciar el sabor.',
      'Refrigera hasta que esté muy fría (mínimo 1 hora). Sirve en vasos altos con mucho hielo y una rodaja de limón. La jamaica también puede servirse caliente como té de hibisco.',
    ],
  },
  {
    title: 'Mojito Cubano',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRARCwNw-OlXDzxfCSwaZaA7oD-pWW4nMFAPezxz4S31w&s=10',
    category: 'bebida', difficulty: 'facil', cook_time: '5 min',
    description: 'Mojito refrescante de hierbabuena con ron y limón.',
    ingredients: ['2 oz ron blanco', '1 limón', '1 cdta azúcar', '6 hojas hierbabuena', 'Agua mineral', 'Hielo'],
    steps: [
      'Coloca las hojas de hierbabuena fresca con el azúcar en el vaso. Machaca suavemente con un muddler o cuchara de madera. No destroces las hojas, solo presiónales para liberar los aceites esenciales sin amargar.',
      'Exprime el jugo del limón fresco directamente en el vaso sobre la hierbabuena macerada. Mezcla para que los sabores se integren.',
      'Agrega el ron blanco cubano (Havana Club o Bacardí son los tradicionales). La calidad del ron impacta directamente en el resultado.',
      'Llena el vaso con hielo picado o cubos. El hielo debe ocupar 3/4 del vaso.',
      'Completa con agua mineral con gas fría. Agrega suavemente para no perder las burbujas.',
      'Mezcla suavemente con una pajilla larga, de arriba hacia abajo solo 2-3 veces. No revuelvas en exceso.',
      'Decora con una ramita de hierbabuena fresca (da un golpe suave en la palma de tu mano para activar el aroma antes de colocarla). Sirve inmediatamente.',
    ],
  },
  {
    title: 'Champurrado',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyJYObbWizt0Ekd6Lu9kyxRdiXuOaLo8qe5to2ltbVyQ&s=10',
    category: 'bebida', difficulty: 'media', cook_time: '30 min',
    description: 'Bebida espesa caliente de chocolate con masa de maíz.',
    ingredients: ['1 litro leche', '1 barra chocolate mesa', '2 cdas masa maíz', '1 rama canela', 'Azúcar'],
    steps: [
      'Disuelve la masa de maíz (masa para tamales) en 1/2 taza de leche fría, batiendo hasta que no haya grumos. Este es el paso más importante para evitar una textura grumosa.',
      'En una olla mediana, calienta el resto de la leche con la rama de canela a fuego medio. Mueve ocasionalmente.',
      'Cuando la leche esté caliente (antes de hervir), agrega el chocolate de mesa partido en trozos. Revuelve constantemente con un molinillo o batidor hasta que se disuelva por completo.',
      'Una vez disuelto el chocolate, agrega la mezcla de masa disuelta poco a poco, batiendo continuamente para evitar grumos.',
      'Cocina a fuego medio-bajo, revolviendo constantemente con movimientos circulares. El champurrado espesará gradualmente en 10-15 minutos.',
      'Agrega azúcar al gusto (el chocolate de mesa ya trae algo de dulzor). Prueba y ajusta.',
      'El champurrado estará listo cuando cubra el dorso de una cuchara y al pasar el dedo, la línea se mantenga. Retira la canela. Sirve caliente en jarros de barro para una experiencia auténtica.',
    ],
  },
  {
    title: 'Limonada de Hierbabuena',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3-bGpCntJB6chYgrBUW6f-G89GRZF7bKx-t3dvz5NFQ&s=10',
    category: 'bebida', difficulty: 'facil', cook_time: '5 min',
    description: 'Limonada fresca con hierbabuena y jengibre.',
    ingredients: ['4 limones', '6 hojas hierbabuena', '1 trozo jengibre', '1 litro agua', 'Azúcar', 'Hielo'],
    steps: [
      'Prepara un jarabe simple: hierve 1/4 taza de agua con 1/4 taza de azúcar hasta disolver. Deja enfriar. Esto endulza sin dejar azúcar sin disolver.',
      'Exprime los 4 limones (evita las semillas). Debes obtener aproximadamente 120 ml de jugo fresco.',
      'Pela y ralla finamente el jengibre (1 cda). El jengibre fresco aporta un picor suave y refrescante.',
      'En una jarra grande, combina el jugo de limón, el jengibre rallado y el jarabe simple. Mezcla bien.',
      'Agrega el litro de agua fría. Ajusta el dulzor y acidez según tu gusto.',
      'Machaca suavemente las hojas de hierbabuena con los dedos y agrégalas a la jarra. Deja infusionar 10 minutos en el refrigerador.',
      'Sirve en vasos con hielo abundante. Cuela al servir si no deseas las hojas de hierbabuena en el vaso. Decora con rodaja de limón y ramita de hierbabuena fresca.',
    ],
  },
  {
    title: 'Tostadas de Camarón Agridulce',
    image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT9cj_-RGIuEYim2t81Qex5D51KrHD9llEnDRDQOQUIA&s=10',
    category: 'agridulce', difficulty: 'media', cook_time: '30 min',
    description: 'Tostadas crujientes con camarones en salsa de mango.',
    ingredients: ['8 tostadas', '300 g camarones', '1 mango', '1 pimiento rojo', '1 cda vinagre', '1 cda azúcar', 'Aguacate'],
    steps: [
      'Limpia y desveina los camarones. Sécalos muy bien con papel absorbente. Sazona con sal, pimienta, ajo en polvo y una pizca de chile en polvo.',
      'Prepara la salsa de mango: licúa la pulpa de mango con el vinagre de manzana, azúcar, sal y una pizca de chile. Prueba el balance agridulce. Ajusta si es necesario.',
      'Calienta sartén o plancha a fuego muy alto con una pizca de aceite. Cuando humee, saltea los camarones 2 minutos por lado hasta que estén rosados y con ligero dorado. No los sobre-cocines o quedarán chiclosos.',
      'En el mismo sartén, saltea el pimiento rojo en juliana 2-3 minutos hasta que esté tierno pero crujiente.',
      'Prepara las tostadas: extrae el aguacate y machaca con limón, sal y chile. Unta sobre cada tostada.',
      'Arma las tostadas: aguacate + camarones + pimiento rojo salteado.',
      'Vierte la salsa de mango agridulce por encima. Decora con cilantro fresco y rodajas de limón. Sirve de inmediato para que las tostadas no se ablanden.',
    ],
  },
];

async function seed(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Limpiar datos existentes (en orden por FK)
    await client.query('DELETE FROM recipe_steps');
    await client.query('DELETE FROM recipe_ingredients');
    await client.query('DELETE FROM recipes');
    await client.query('SELECT setval(\'recipes_id_seq\', 1, false)');

    for (const recipe of RECIPES) {
      // Insertar receta
      const { rows } = await client.query(
        `INSERT INTO recipes (title, category, difficulty, cook_time, description, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [recipe.title, recipe.category, recipe.difficulty, recipe.cook_time, recipe.description, recipe.image_url]
      );
      const recipeId: number = rows[0].id;

      // Insertar ingredientes
      for (let i = 0; i < recipe.ingredients.length; i++) {
        await client.query(
          'INSERT INTO recipe_ingredients (recipe_id, name, order_index) VALUES ($1, $2, $3)',
          [recipeId, recipe.ingredients[i], i]
        );
      }

      // Insertar pasos
      for (let i = 0; i < recipe.steps.length; i++) {
        await client.query(
          'INSERT INTO recipe_steps (recipe_id, step_number, description) VALUES ($1, $2, $3)',
          [recipeId, i + 1, recipe.steps[i]]
        );
      }

      console.log(`  [${recipeId}] ${recipe.title}`);
    }

    await client.query('COMMIT');
    console.log(`\nSeed completado: ${RECIPES.length} recetas insertadas`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(' Error en seed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
