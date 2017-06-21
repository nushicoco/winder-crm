'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      const records = [
          {
              env         : 'אביד',
              subEnv      : 'רגיל',
              subject     : 'הגדרות Export מומלצות',
              solution    : '',
              solutionURL : 'https://res.cloudinary.com/dzbelv6cv/image/upload/v1496926821/assets/Definitions.pdf'
          },

          {
              env         : 'אביד',
              subEnv      : 'רגיל',
              subject     : 'הקלטה באביד',
              solution    : '',
              solutionURL : 'https://res.cloudinary.com/dzbelv6cv/raw/upload/v1497436560/assets/Recording_In_Avid.pdf'
          },

          {
              env         : 'מחשב',
              subEnv      : "רגיל",
              subject     : "הדפסה במתחם",
              solution    : '',
              solutionURL : 'https://res.cloudinary.com/dzbelv6cv/raw/upload/v1497437103/assets/Printing.pdf'
          },

          {
              env         : 'אביד',
              subEnv      : 'interplay',
              subject     : 'הדלקת Interplay',
              solution    : 'כדי להדליק את האינטרפליי יש לרשום את הפקודה WorkgroupOverride off יש ללחוץ אנטר ולהיכנס מחדש לאביד',
              solutionURL : ''
          },

          {
              env         : 'אביד',
              subEnv      : 'interplay',
              subject     : 'כיבוי Interplay',
              solution    : 'כדי לכבות את האינטרפליי יש לרשום ב console (קיצור מקלדת ctrl+6) את הפקודה הבאה WorkgroupOverride on יש ללחוץ אנטר ולהיכנס מחדש לאביד',
              solutionURL : ''
          }
      ]

      return queryInterface.bulkInsert('frequentProblems', records)
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.bulkDelete('frequentProblems', null, {});
  }
};
