'use strict';

let expect = require('chai').expect;

describe('Test Suite', function() {

  const UG = require('../module.js');

  const Unit = require('../lib/unit/unit.js');
  const Node = require('../lib/unit/node.js');
  const Edge = require('../lib/unit/edge.js');

  const Collection = require('../lib/collection/collection.js');
  const NodeCollection = require('../lib/collection/node_collection.js');
  const EdgeCollection = require('../lib/collection/edge_collection.js');

  describe('UnitGraph', function() {

    describe('Graph', function() {

      let graph = new UG.Graph();

      it('Should have the appropriate hidden properties', function() {

        expect(graph._lookup).to.be.an('object');
        expect(graph._nodes).to.be.an('array');
        expect(graph._edges).to.be.an('array');
        expect(graph._nodeCollections).to.be.an('object');
        expect(graph._edgeCollections).to.be.an('object');

      });

      it('Should create a NodeCollection', function() {

        expect(graph.nodes('testNode')).to.be.an.instanceof(Collection);
        expect(graph.nodes('testNode')).to.be.an.instanceof(NodeCollection);

      });

      it('Should create an EdgeCollection', function() {

        expect(graph.edges('testEdge')).to.be.an.instanceof(Collection);
        expect(graph.edges('testEdge')).to.be.an.instanceof(EdgeCollection);

      });

      it('Should give 0 node and edge counts', function() {

        expect(graph.nodeCount()).to.equal(0);
        expect(graph.edgeCount()).to.equal(0);

      });

      it('Should create a node', function() {

        expect(graph.createNode('testNode', {id: 1, hello: 'world'})).to.be.an.instanceof(Node);

      });

      it('Should create an edge', function() {

        expect(graph.createEdge('testEdge', {id: 1, hello: 'world'})).to.be.an.instanceof(Edge);

      });

      it('Should give 1 node and edge counts after creating them', function() {

        expect(graph.nodeCount()).to.equal(1);
        expect(graph.edgeCount()).to.equal(1);

      });

      it('Should find its own node', function() {

        let node = graph._nodes[0];

        expect(graph.find(node.__uniqid__)).to.equal(node);

      });

    });

    describe('Collections', function() {

      let graph = new UG.Graph();
      graph.createNode('testNode', {id: 1, hello: 'world'});
      graph.createEdge('testEdge', {id: 1, hello: 'world'});

      let nc = graph.nodes('testNode');
      let ec = graph.edges('testEdge');

      describe('NodeCollection', function() {

        it('Should have the correct name', function() {

          expect(nc.name()).to.equal('testNode');

        });

        it('Should not have any indices to begin', function() {

          expect(nc.indices().length).to.equal(0);

        });

        it('Should be able to create an index', function() {

          nc.createIndex('id');
          ec.createIndex('id');

          expect(nc.indices().length).to.equal(1);
          expect(nc.indices()[0]).to.equal('id');
          expect(nc._indices).to.contain.all.keys(['id']);

        });

        it('Should be able to find node by id', function() {

          expect(nc.find(1)).to.equal(graph._nodes[0]);

        });

      });

    });

    describe('Units', function() {

      let graph = new UG.Graph();
      graph.createNode('testNode', {id: 1, hello: 'world'});
      graph.createNode('testNode', {id: 2, hello: 'earth'});
      graph.createEdge('testEdge', {id: 1, message: 'hello'});

      let n = graph._nodes[0];
      let n2 = graph._nodes[1];
      let e = graph._edges[0];

      describe('Node', function() {

        it('should have expected node properties', function() {

          expect(n.edges).to.be.an('array');
          expect(n.inputEdges).to.be.an('array');
          expect(n.outputEdges).to.be.an('array');

        });

        it('should be able to set a property', function() {

          expect(n.set('a', 'b')).to.equal('b');

        });

        it('should be able to get a property', function() {

          expect(n.get('a')).to.equal('b');

        });

        it('should have the property', function() {

          expect(n.has('a')).to.equal(true);

        });

        it('should unset the property', function() {

          expect(n.unset('a')).to.equal(true);

        });

        it('should return undefined for get of unset property', function() {

          expect(n.get('a')).to.be.undefined;

        });

      });

      describe('Edge', function() {

        it('should have expected edge properties', function() {

          expect(e).to.have.ownProperty('inputNode');
          expect(e).to.have.ownProperty('outputNode');
          expect(e).to.have.ownProperty('duplex');
          expect(e).to.have.ownProperty('distance');

        });

        it('should link two nodes directionally', function() {

          e.link(n, n2);

          expect(n.inputEdges.indexOf(e)).to.equal(-1);
          expect(n.outputEdges.indexOf(e)).to.be.at.least(0);
          expect(n2.inputEdges.indexOf(e)).to.be.at.least(0);
          expect(n2.outputEdges.indexOf(e)).to.equal(-1);

          expect(e.inputNode).to.equal(n);
          expect(e.outputNode).to.equal(n2);

          expect(e.duplex).to.equal(false);

        });

        it('should link two nodes bidirectionally', function() {

          e.link(n, n2, true);

          expect(n.inputEdges.indexOf(e)).to.be.at.least(0);
          expect(n.outputEdges.indexOf(e)).to.be.at.least(0);
          expect(n2.inputEdges.indexOf(e)).to.be.at.least(0);
          expect(n2.outputEdges.indexOf(e)).to.be.at.least(0);

          expect(e.inputNode).to.equal(n);
          expect(e.outputNode).to.equal(n2);

          expect(e.duplex).to.equal(true);

        });

        it('should unlink nodes', function() {

          e.unlink();

          expect(n.inputEdges.indexOf(e)).to.equal(-1);
          expect(n.outputEdges.indexOf(e)).to.equal(-1);
          expect(n2.inputEdges.indexOf(e)).to.equal(-1);
          expect(n2.outputEdges.indexOf(e)).to.equal(-1);

          expect(e.inputNode).to.be.null;
          expect(e.outputNode).to.be.null;

          expect(e.duplex).to.equal(false);

        });

      });

    });

  });

});
