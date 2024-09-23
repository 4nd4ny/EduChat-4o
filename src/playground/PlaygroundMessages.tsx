import React from "react";

export default function PlaygroundMessages({}) {

  return (
    <div className="h-auto md:h-full w-full flex flex-col rounded border border-gray-300 p-4">
      <label className="text-xs font-medium text-blue-700">TUTORIAL</label>
      <div className="md:flex-1 md:overflow-y-auto">
        
        <em>Les paramètres sur le côté permettent de modifier l'intelligence et le style des réponses de l'IA.</em><br/><br/>
          
        <div>
          <strong>Modèle</strong><br/>         
          OpenAI propose plusieurs modèles, chacun avec des capacités et des spécialisations différentes. La liste proposée est réduite aux meilleurs modèles actuellement disponibles.<br/><br/>
          
          <strong>Température</strong><br/>  
          C'est le paramètre le plus important. Il permet de contrôler le niveau de créativité ou d'aléatoire des réponses générées par le modèle.  
          Pour une tâche qui nécessite des réponses claires et précises (comme un calcul ou une information factuelle), une température basse est préférable.  
          Pour des réponses plus variées et créatives (comme écrire une histoire), une température plus élevée est utile.<br/><br/>

          <strong>Nombre de Tokens Maximum</strong><br/>
          Ce paramètre définit la longueur maximale de la réponse. Les 'tokens' sont des bouts de mots.<br/><br/>

          <strong>Probabilité de Sélection</strong><br/> 
          Le modèle choisira parmi le pourcentage indiqué des résultats les plus probables, limitant ainsi la créativité mais augmentant la précision. Ne devrait jamais être nul.<br/><br/>

          <strong>Pénalité de Fréquence</strong><br/> 
          Pénalise les répétitions dans la réponse générée. Plus la valeur est élevée, plus le modèle sera dissuadé de répéter des phrases ou des mots qu'il a déjà utilisés.<br/><br/>
          
          <strong>Pénalité de Présence</strong><br/> 
          Pénalise l'apparition de nouveaux sujets dans la réponse. Plus il est élevé, plus le modèle sera incité à introduire de nouvelles idées ou à changer de sujet.<br/><br/>
        </div> 
  
      </div>
    </div>
  );
}