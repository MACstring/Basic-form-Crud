"use client";
import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ughzzxqfwubzlopegvyd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnaHp6eHFmd3ViemxvcGVndnlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0MzM5NzUsImV4cCI6MjAzMTAwOTk3NX0.dQzHDQU0HQ1UoBx4kB6FiLC7ze6CCIx4LzSWOxfQpk4';
const supabase = createClient(supabaseUrl, supabaseKey);

interface StudentInfo {
  id: number;
  name: string;
  class: string;
}

function Home() {
  const [studentInfos, setStudentInfos] = useState<StudentInfo[]>([]);
  const [name, setName] = useState('');
  const [classValue, setClassValue] = useState('');

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
        .insert([{ name, class: classValue }])
        .select();
      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setStudentInfos([...studentInfos, data[0] as StudentInfo]);
        setName('');
        setClassValue('');
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
    addStudentInfo();
  };

  return (
    <main className="max-w-4xl mx-auto mt-4">
      <div className="text-center my-5 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Student Information App</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="Class"
            value={classValue}
            onChange={(e) => setClassValue(e.target.value)}
            className="input input-bordered w-full"
            required
          />
          <button type="submit" className="btn btn-primary w-full">
            Add Student Information
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentInfos.map((studentInfo) => (
              <tr key={studentInfo.id}>
                <td>{studentInfo.name}</td>
                <td>{studentInfo.class}</td>
                <td>
                  <button
                    onClick={() => deleteStudentInfo(studentInfo.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Home;
