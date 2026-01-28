w
<script setup lang="ts">
import {
  BookOpen,
  Github,
  Globe,
  Sprout,
  MessageSquareCode,
  BookMarked
} from 'lucide-vue-next';

import NavMain from './NavMain.vue';
import NavProjects from './NavProjects.vue';
import NavUser from './NavUser.vue';
import TeamSwitcher from '../shell/TeamSwitcher.vue';
import type { SidebarProps } from '@/components/ui/sidebar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: 'icon',
});

const data = {
  user: {
    name: 'Nikolas Campos',
    email: 'nikolas@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'GeoPlant',
      plan: 'geoplant',
    },
  ],
  navMain: [
    {
      title: 'Atlas',
      url: '/atlas',
      icon: Globe,
    },
    {
      title: 'Catalog',
      url: '/catalog',
      icon: BookMarked,
    },
    {
      title: 'Herbarium',
      url: '/herbarium',
      icon: Sprout,
    },
  ],
  projects: [
    {
      name: 'Guide',
      url: '/guide',
      icon: BookOpen,
    },
    {
      name: 'Repository',
      url: 'https://github.com/nikol4ss/geoplant',
      icon: Github,
    },
    {
      name: 'Feedbacks',
      url: '/feedbacks',
      icon: MessageSquareCode,
    },
  ],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavProjects :projects="data.projects" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
