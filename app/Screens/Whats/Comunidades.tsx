import React from "react";
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from "react-native";
import GroupCard from "@/components/ui/GroupCard";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton2";

// Importação direta das imagens
import Image1 from "@/components/svg/Whats/Extensao";

const groups = [
  {
    id: '1',
    title: 'Divisão de Pesquisa e Extensão',
    description: 'Grupos destinado aos alunos extensionistas e pesquisadores.',
    link: 'https://chat.whatsapp.com/G2poYJs1dRXJVHszVJIefx',
    image: Image1,
    buttonText: 'Participar da comunidade',
  },
];

const GroupsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Comunidades do Campus</Text>
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
    backgroundColor: "#fff",
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
