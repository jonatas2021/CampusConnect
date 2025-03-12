import React from "react";
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from "react-native";
import GroupCard from "@/components/ui/GroupCard";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton2";

// Importação direta das imagens
import Image1 from "@/components/svg/Whats/Lanche";
import Image2 from "@/components/svg/Whats/Informacoes";
import Image3 from "@/components/svg/Whats/Daee";

const groups = [
  {
    id: '1',
    title: 'Lanchinhos IFPE - Igarassu',
    description: 'Grupo destinado as vendas voluntárias do campus.',
    link: 'https://chat.whatsapp.com/Fx0PiGLv1gmGRKJxaOdU26',
    image: Image1, 
    buttonText: 'Entrar no grupo',
  },
  {
    id: '2',
    title: 'Informações/Campus Igarassu',
    description: 'Grupo destinado a troca de informações.',
    link: 'https://chat.whatsapp.com/FBmLs5301j45GUJam7rtlA',
    image: Image2,
    buttonText: 'Entrar no grupo',

  },
  {
    id: '3',
    title: 'DAEE',
    description: 'Grupo destinado excluisivamente aos alunos inscritos na Manutenção Acadêmica',
    link: 'https://chat.whatsapp.com/L8cBAWoXWP6IO7LT7OS6Xt',
    image: Image3,
    buttonText: 'Entrar no grupo',

  },
];

const GroupsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Grupos do WhatsApp</Text>
      <View style={styles.separator} />

      <ScrollView contentContainerStyle={styles.content}>
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            image={group.image} // ✅ Nome correto da prop
            title={group.title}
            description={group.description}
            link={group.link}
            buttonText={group.buttonText} 
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFFFD6",
    paddingTop: "6%",
  },
  content: {
    paddingHorizontal: "4%",
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
    marginTop: "10%",
  },
  separator: {
    width: "90%",
    height: 2,
    backgroundColor: "#000",
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default GroupsScreen;
