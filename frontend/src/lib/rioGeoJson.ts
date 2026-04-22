// GeoJSON simplificado dos bairros do Rio de Janeiro
// Polígonos aproximados dos bairros presentes no seed do sistema
// Fonte de referência: dados.rio / IBGE

export const RIO_BAIRROS_GEOJSON = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      properties: { nome: 'Madureira' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.356, -22.868], [-43.330, -22.868], [-43.330, -22.882],
          [-43.356, -22.882], [-43.356, -22.868]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Complexo do Alemão' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.282, -22.852], [-43.258, -22.852], [-43.258, -22.866],
          [-43.282, -22.866], [-43.282, -22.852]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Rocinha' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.255, -22.982], [-43.235, -22.982], [-43.235, -22.994],
          [-43.255, -22.994], [-43.255, -22.982]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Bangu' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.478, -22.878], [-43.448, -22.878], [-43.448, -22.898],
          [-43.478, -22.898], [-43.478, -22.878]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Campo Grande' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.578, -22.888], [-43.540, -22.888], [-43.540, -22.912],
          [-43.578, -22.912], [-43.578, -22.888]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Santa Cruz' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.705, -22.896], [-43.665, -22.896], [-43.665, -22.916],
          [-43.705, -22.916], [-43.705, -22.896]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Realengo' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.438, -22.870], [-43.410, -22.870], [-43.410, -22.888],
          [-43.438, -22.888], [-43.438, -22.870]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Jacarepaguá' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.388, -22.940], [-43.348, -22.940], [-43.348, -22.962],
          [-43.388, -22.962], [-43.388, -22.940]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Pavuna' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.378, -22.808], [-43.348, -22.808], [-43.348, -22.828],
          [-43.378, -22.828], [-43.378, -22.808]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Vigário Geral' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.322, -22.824], [-43.298, -22.824], [-43.298, -22.840],
          [-43.322, -22.840], [-43.322, -22.824]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Guadalupe' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.368, -22.836], [-43.344, -22.836], [-43.344, -22.852],
          [-43.368, -22.852], [-43.368, -22.836]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Acari' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.390, -22.830], [-43.368, -22.830], [-43.368, -22.846],
          [-43.390, -22.846], [-43.390, -22.830]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Anchieta' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.358, -22.832], [-43.336, -22.832], [-43.336, -22.848],
          [-43.358, -22.848], [-43.358, -22.832]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Cosmos' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.638, -22.896], [-43.608, -22.896], [-43.608, -22.916],
          [-43.638, -22.916], [-43.638, -22.896]
        ]]
      }
    },
    {
      type: 'Feature' as const,
      properties: { nome: 'Padre Miguel' },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [-43.458, -22.874], [-43.430, -22.874], [-43.430, -22.892],
          [-43.458, -22.892], [-43.458, -22.874]
        ]]
      }
    },
  ]
}
