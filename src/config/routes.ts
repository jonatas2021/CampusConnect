export const knownRoutes = [
    "/Screens/Aulas",
    "/Screens/Bolsas",
    "/Screens/Configurações",
    "/Screens/Notificações",
    "/Screens/Hello",
    "/Screens/Questions",
    "/Screens/Carousel",
    "/Screens/index",
    "/Screens/Contato",
    "/Screens/BusSchedule/BusScheduleScreen",
    "/Screens/BusSchedule/BusScheduleScreen2",
    "/Screens/Linha",
    "/Screens/Calendar",
    "/Screens/Support/ChatScreen",
    "/Screens/FAQ",
    "/Screens/Nucleos",
    "/Screens/Nucleos/Neabi",
    "/Screens/Nucleos/Neged",
    "/Screens/Nucleos/Napne",
    "/Screens/Nucleos/N60+",
    "/Screens/Nucleos/Nac",
    "/Screens/Cursos",
    "/Screens/Cursos/Adm1",
    "/Screens/Cursos/Log1",
    "/Screens/Cursos/Gq1",
    "/Screens/Cursos/Ipi1",
    "/Screens/Cursos/Tsi1",
    "/Screens/Cursos/Adm2",
    "/Screens/Cursos/Gq2",
    "/Screens/Cursos/Ipi2",
    "/Screens/Cursos/Log2",
    "/Screens/Cursos/Tsi2",
    "/Screens/Setores",
    "/Screens/Setores/Dapd",
    "/Screens/Setores/Depex",
    "/Screens/Setores/Den",
    "/Screens/Setores/Cradt",
    "/Screens/Bolsas/Estagio",
    "/Screens/Bolsas/Extensao",
    "/Screens/Bolsas/Manutencao",
    "/Screens/Bolsas/Monitoria",
    "/Screens/Bolsas/Pesquisa",
    "/Screens/Bolsas/Tutoria",
    "/Screens/Whats",
    "/Screens/Whats/Groups",
    "/Screens/Whats/Comunidades",
    "/Screens/Whats/Contatos",
    "/Screens/Servico",
    "/Screens/Notifications",
    "/Screens/Notification/CreateNotification",
    "/Screens/Notification/UpdateNotification",
    "/Screens/Login",
    "/Screens/Carteira",
    "/Screens/Carteirafree",
  ] as const;
  
  export type KnownRoute = (typeof knownRoutes)[number];