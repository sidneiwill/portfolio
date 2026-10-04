import type { Locale } from "@/i18n/config";

export const areaIds = [
  "programming",
  "reverse",
  "modeling",
  "electronics",
] as const;
export type AreaId = (typeof areaIds)[number];
export type SectionId = AreaId | "home" | "about" | "projects" | "contact";

type ExplorerContent = {
  navigation: Record<SectionId, string>;
  intro: string;
  openCube: string;
  details: string;
  fallback: string;
  areas: Record<
    AreaId,
    {
      summary: string;
      parts: { id: string; label: string; description: string }[];
    }
  >;
};

export const explorerContent: Record<Locale, ExplorerContent> = {
  "pt-BR": {
    navigation: {
      home: "Início",
      programming: "Programação",
      reverse: "Engenharia reversa",
      modeling: "Modelagem 3D",
      electronics: "Eletrônica",
      about: "Sobre",
      projects: "Projetos",
      contact: "Contato",
    },
    intro: "Explore o que há por dentro.",
    openCube: "Clique para explorar o portfólio.",
    details: "Explore as partes",
    fallback:
      "A visualização 3D não está disponível. Explore as áreas pelo menu.",
    areas: {
      programming: {
        summary:
          "Da interface aos dados, cada parte de um sistema trabalha em conjunto para transformar uma ideia em algo utilizável.",
        parts: [
          {
            id: "interface",
            label: "Interface",
            description:
              "A interface conecta pessoas ao sistema, apresentando informações e oferecendo ações claras.",
          },
          {
            id: "logic",
            label: "Lógica",
            description:
              "A lógica organiza regras e decisões, transformando entradas em resultados previsíveis.",
          },
          {
            id: "data",
            label: "Dados",
            description:
              "Os dados representam o estado do sistema. Sua organização permite consultar, guardar e relacionar informações.",
          },
        ],
      },
      reverse: {
        summary:
          "Observar um sistema, separar suas camadas e investigar seu comportamento ajuda a compreender como ele foi construído.",
        parts: [
          {
            id: "layers",
            label: "Camadas",
            description:
              "Separar um sistema em camadas ajuda a reconhecer responsabilidades e relações entre componentes.",
          },
          {
            id: "analysis",
            label: "Análise",
            description:
              "Comparar entradas, saídas e comportamento permite formular e verificar hipóteses sobre o funcionamento interno.",
          },
          {
            id: "reconstruction",
            label: "Reconstrução",
            description:
              "Reunir as observações em um modelo explica a estrutura e o comportamento que foram identificados.",
          },
        ],
      },
      modeling: {
        summary:
          "Vértices, arestas e faces formam uma malha. Suas relações definem a forma e a estrutura de um objeto tridimensional.",
        parts: [
          {
            id: "vertices",
            label: "Vértices",
            description:
              "Vértices são pontos no espaço. Mover esses pontos altera a forma da malha.",
          },
          {
            id: "edges",
            label: "Arestas",
            description:
              "Arestas conectam vértices e definem os limites das faces, organizando a topologia da malha.",
          },
          {
            id: "faces",
            label: "Faces",
            description:
              "Faces são superfícies delimitadas por arestas. Juntas, descrevem a superfície do objeto.",
          },
        ],
      },
      electronics: {
        summary:
          "Componentes, sinais e conexões trabalham juntos para transformar energia e informação em comportamento físico.",
        parts: [
          {
            id: "components",
            label: "Componentes",
            description:
              "Cada componente exerce uma função no circuito, como limitar corrente, armazenar energia ou controlar sinais.",
          },
          {
            id: "signals",
            label: "Sinais",
            description:
              "Variações de tensão ou corrente transportam informação e permitem observar o comportamento de um circuito.",
          },
          {
            id: "connections",
            label: "Conexões",
            description:
              "Trilhas e fios conectam componentes, formando os caminhos por onde a corrente pode circular.",
          },
        ],
      },
    },
  },
  "en-US": {
    navigation: {
      home: "Home",
      programming: "Programming",
      reverse: "Reverse engineering",
      modeling: "3D modeling",
      electronics: "Electronics",
      about: "About",
      projects: "Projects",
      contact: "Contact",
    },
    intro: "Explore what is inside.",
    openCube: "Click to explore the portfolio.",
    details: "Explore the parts",
    fallback: "The 3D view is unavailable. Explore the areas using the menu.",
    areas: {
      programming: {
        summary:
          "From the interface to the data, each part of a system works together to turn an idea into something usable.",
        parts: [
          {
            id: "interface",
            label: "Interface",
            description:
              "The interface connects people to the system by presenting information and providing clear actions.",
          },
          {
            id: "logic",
            label: "Logic",
            description:
              "Logic organizes rules and decisions, turning inputs into predictable results.",
          },
          {
            id: "data",
            label: "Data",
            description:
              "Data represents the state of the system. Its organization allows information to be retrieved, stored, and related.",
          },
        ],
      },
      reverse: {
        summary:
          "Observing a system, separating its layers, and investigating its behavior helps explain how it was built.",
        parts: [
          {
            id: "layers",
            label: "Layers",
            description:
              "Separating a system into layers helps identify responsibilities and relationships between components.",
          },
          {
            id: "analysis",
            label: "Analysis",
            description:
              "Comparing inputs, outputs, and behavior makes it possible to formulate and test hypotheses about internal operation.",
          },
          {
            id: "reconstruction",
            label: "Reconstruction",
            description:
              "Combining observations into a model explains the structure and behavior that have been identified.",
          },
        ],
      },
      modeling: {
        summary:
          "Vertices, edges, and faces form a mesh. Their relationships define the shape and structure of a three-dimensional object.",
        parts: [
          {
            id: "vertices",
            label: "Vertices",
            description:
              "Vertices are points in space. Moving these points changes the shape of the mesh.",
          },
          {
            id: "edges",
            label: "Edges",
            description:
              "Edges connect vertices and define face boundaries, organizing the topology of the mesh.",
          },
          {
            id: "faces",
            label: "Faces",
            description:
              "Faces are surfaces bounded by edges. Together, they describe the surface of the object.",
          },
        ],
      },
      electronics: {
        summary:
          "Components, signals, and connections work together to turn energy and information into physical behavior.",
        parts: [
          {
            id: "components",
            label: "Components",
            description:
              "Each component serves a function in the circuit, such as limiting current, storing energy, or controlling signals.",
          },
          {
            id: "signals",
            label: "Signals",
            description:
              "Changes in voltage or current carry information and reveal the behavior of a circuit.",
          },
          {
            id: "connections",
            label: "Connections",
            description:
              "Traces and wires connect components, forming the paths through which current can flow.",
          },
        ],
      },
    },
  },
  "es-AR": {
    navigation: {
      home: "Inicio",
      programming: "Programación",
      reverse: "Ingeniería inversa",
      modeling: "Modelado 3D",
      electronics: "Electrónica",
      about: "Sobre mí",
      projects: "Proyectos",
      contact: "Contacto",
    },
    intro: "Explorá lo que hay adentro.",
    openCube: "Hacé clic para explorar el portfolio.",
    details: "Explorá las partes",
    fallback:
      "La vista 3D no está disponible. Explorá las áreas desde el menú.",
    areas: {
      programming: {
        summary:
          "Desde la interfaz hasta los datos, cada parte de un sistema trabaja en conjunto para convertir una idea en algo utilizable.",
        parts: [
          {
            id: "interface",
            label: "Interfaz",
            description:
              "La interfaz conecta a las personas con el sistema, presentando información y ofreciendo acciones claras.",
          },
          {
            id: "logic",
            label: "Lógica",
            description:
              "La lógica organiza reglas y decisiones, transformando entradas en resultados predecibles.",
          },
          {
            id: "data",
            label: "Datos",
            description:
              "Los datos representan el estado del sistema. Su organización permite consultar, guardar y relacionar información.",
          },
        ],
      },
      reverse: {
        summary:
          "Observar un sistema, separar sus capas e investigar su comportamiento ayuda a comprender cómo fue construido.",
        parts: [
          {
            id: "layers",
            label: "Capas",
            description:
              "Separar un sistema en capas ayuda a reconocer responsabilidades y relaciones entre componentes.",
          },
          {
            id: "analysis",
            label: "Análisis",
            description:
              "Comparar entradas, salidas y comportamiento permite formular y verificar hipótesis sobre el funcionamiento interno.",
          },
          {
            id: "reconstruction",
            label: "Reconstrucción",
            description:
              "Reunir las observaciones en un modelo explica la estructura y el comportamiento que se identificaron.",
          },
        ],
      },
      modeling: {
        summary:
          "Vértices, aristas y caras forman una malla. Sus relaciones definen la forma y la estructura de un objeto tridimensional.",
        parts: [
          {
            id: "vertices",
            label: "Vértices",
            description:
              "Los vértices son puntos en el espacio. Mover esos puntos modifica la forma de la malla.",
          },
          {
            id: "edges",
            label: "Aristas",
            description:
              "Las aristas conectan vértices y definen los límites de las caras, organizando la topología de la malla.",
          },
          {
            id: "faces",
            label: "Caras",
            description:
              "Las caras son superficies delimitadas por aristas. Juntas, describen la superficie del objeto.",
          },
        ],
      },
      electronics: {
        summary:
          "Componentes, señales y conexiones trabajan juntos para transformar energía e información en comportamiento físico.",
        parts: [
          {
            id: "components",
            label: "Componentes",
            description:
              "Cada componente cumple una función en el circuito, como limitar corriente, almacenar energía o controlar señales.",
          },
          {
            id: "signals",
            label: "Señales",
            description:
              "Las variaciones de tensión o corriente transportan información y permiten observar el comportamiento de un circuito.",
          },
          {
            id: "connections",
            label: "Conexiones",
            description:
              "Las pistas y los cables conectan componentes, formando los caminos por los que puede circular la corriente.",
          },
        ],
      },
    },
  },
};
