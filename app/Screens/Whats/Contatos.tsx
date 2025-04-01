import React from "react";
import { StyleSheet, SafeAreaView, View, Text, ScrollView } from "react-native";
import GroupCard from "@/components/ui/GroupCard";
import { RFValue } from "react-native-responsive-fontsize";
import BackButton from "@/components/BackButton";

// Importação direta das imagens
import Image1 from "@/components/svg/Whats/Cradt";

const groups = [
  {
    id: '1',
    title: 'CRADT',
    description: 'Contatato da Coordenação de Registros Acadêmicos (CRADT), que oferece suporte à comunidade acadêmica e ao público externo.',
    link: 'https://wa.me/+558181732446',
    image: Image1,
    buttonText: 'Entrar em contato',
  },
];

const GroupsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Contatos</Text>
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
