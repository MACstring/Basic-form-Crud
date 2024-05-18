"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import '@mantine/core/styles.css';
import { Button, TextInput, Container, Title, Table, MantineProvider, createTheme, mergeThemeOverrides, Center } from '@mantine/core';

const supabaseUrl = 'https://ughzzxqfwubzlopegvyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaHp6eHFmd3ViemxvcGVndnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0MzM5NzUsImV4cCI6MjAzMTAwOTk3NX0.dQzHDQU0HQ1UoBx4kB6FiLC7ze6CCIx4LzSWOxfQpk4';
const supabase = createClient(supabaseUrl, supabaseKey);

const theme1 = createTheme({
  primaryColor: 'orange',
  defaultRadius: 0,
});

const theme2 = createTheme({
  cursorType: 'pointer',
});
const myTheme = mergeThemeOverrides(theme1, theme2);

interface StudentInfo {
  id: number;
  name: string;
  class: string;
  phone: number;
}

function Home() {
  const [studentInfos, setStudentInfos] = useState<StudentInfo[]>([]);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [classValue, setClassValue] = useState('');
  const [classError, setClassError] = useState('');
  const [phoneValue, setPhoneValue] = useState('');
  const [phoneError, setPhoneError] = useState(''); 
  
  useEffect(() => {
    fetchStudentInfos();
  }, []);

  const fetchStudentInfos = async () => {
    try {
      const { data, error } = await supabase
        .from('Student-info')
        .select('*');
      if (error) throw error;
      if (data) setStudentInfos(data as StudentInfo[]);
    } catch (error: any) {
      console.log('Error fetching student information:', error.message);
    }
  };

  const addStudentInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('Student-info')
        .insert([{ name, class: classValue, phone: phoneValue }])
        .select();
      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setStudentInfos([...studentInfos, data[0] as StudentInfo]);
        setName('');
        setClassValue('');
        setPhoneValue('');
      }
    } catch (error: any) {
      console.error('Error adding student information:', error);
    }
  };

  const deleteStudentInfo = async (id: number) => {
    try {
      const { error } = await supabase
        .from('Student-info')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setStudentInfos(studentInfos.filter(studentInfo => studentInfo.id !== id));
    } catch (error: any) {
      console.log('Error deleting student information:', error.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
      setNameError('Please enter a valid name (alphabets and spaces only).');
      return;
    }
    const classRegex = /^[a-zA-Z0-9\s]+$/;
    if (!classRegex.test(classValue)) {
      setClassError('Please enter a valid class (alphanumeric and spaces only).');
      return;
    }
    if (!phoneValue) {
      setPhoneError('Phone number is required');
      return;
    }
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(phoneValue)) {
      setPhoneError('Please enter a valid phone number with maximum 11 digits.');
      return;
    }
    addStudentInfo();
  };

  return (
     <MantineProvider theme={myTheme}>
    <div className="">
      <Container>
        <Title>Student Information App</Title>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError('');
            }}
            required
            error={nameError}
            mb="sm"
          />
          <TextInput
            label="Class"
            placeholder="Enter class"
            value={classValue}
            onChange={(e) => {
              setClassValue(e.target.value);
              setClassError('');
            }}
            required
            error={classError}
            mb="sm"
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone number"
            value={phoneValue}
            onChange={(e) => {
              setPhoneValue(e.target.value);
              setPhoneError('');
            }}
            required
            error={phoneError}
            mb="sm"
          />
          <Button type="submit" fullWidth>
            Add Student Information
          </Button>
        </form>
        <Table my="xl">
  <thead className="text-left">
    <tr>
      <th className="border border-gray-300 px-4 py-2">Name</th>
      <th className="border border-gray-300 px-4 py-2">Class</th>
      <th className="border border-gray-300 px-4 py-2">Phone number</th>
      <th className="border border-gray-300 px-4 py-2 text-right">Actions</th>
    </tr>
  </thead>
  <tbody>
    {studentInfos.map((studentInfo) => (
      <tr key={studentInfo.id}>
        <td className="border border-gray-300 px-4 py-2">{studentInfo.name}</td>
        <td className="border border-gray-300 px-4 py-2">{studentInfo.class}</td>
        <td className="border border-gray-300 px-4 py-2">{studentInfo.phone}</td>
        <td className="border border-gray-300 px-4 py-2 text-right">
          <Button
            onClick={() => deleteStudentInfo(studentInfo.id)}
            color="red"
          >
            Delete
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

      </Container>
      </div>
    </MantineProvider>
  );
}

export default Home;
